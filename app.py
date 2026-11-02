from flask import Flask, render_template, request, Response, stream_with_context
from program import circle_main, balls_main, dice_main, monty_main
import json
import queue
import threading

app = Flask(__name__)


# Main page
@app.route("/")
def index():
    return render_template("index.html")


# circle simulation page
@app.route("/sims/circle")
def circle():
    return render_template("sims/circle.html")


# circle execution
@app.route("/run/circle")
def run_circle():

    number = int(request.args.get("number"))
    updates = queue.Queue()

    def callback(text, body):
        updates.put({
            "output": text,
            "body": body
        })

    def worker():
        try:
            circle_main(number, callback)
        except Exception as e:
            updates.put({"error": str(e)})
        finally:
            updates.put(None)

    threading.Thread(target=worker, daemon=True).start()

    def generate():
        while True:
            message = updates.get()

            if message is None:
                yield "data: {\"finished\": true}\n\n"
                break

            yield f"data: {json.dumps(message)}\n\n"

    return Response(
        stream_with_context(generate()),
        mimetype="text/event-stream"
    )


# Dice simulation page
@app.route("/sims/dice")
def dice():
    return render_template("sims/dice.html")

@app.route("/run/dice")
def run_dice():
    number = int(request.args.get("number"))
    sides = int(request.args.get("sides"))
    asked = int(request.args.get("asked"))

    updates = queue.Queue()

    def callback(text, body):
        updates.put({
            "output": text,
            "body": body
        })

    def worker():
        try:
            dice_main(number, sides, asked, callback)
        except Exception as e:
            updates.put({"error": str(e)})
        finally:
            updates.put(None)

    threading.Thread(target=worker, daemon=True).start()

    def generate():
        while True:
            message = updates.get()

            if message is None:
                yield 'data: {"finished": true}\n\n'
                break

            yield f"data: {json.dumps(message)}\n\n"

    return Response(
        stream_with_context(generate()),
        mimetype="text/event-stream"
    )


# Monty Hall simulation page
@app.route("/sims/monty")
def monty():
    return render_template("sims/monty.html")

@app.route("/run/monty")
def run_monty():
    number = int(request.args.get("number"))

    updates = queue.Queue()

    def callback(text, body):
        updates.put({
            "output": text,
            "body": body
        })

    def worker():
        try:
            monty_main(number, callback)
        except Exception as e:
            updates.put({"error": str(e)})
        finally:
            updates.put(None)

    threading.Thread(target=worker, daemon=True).start()

    def generate():
        while True:
            message = updates.get()

            if message is None:
                yield 'data: {"finished": true}\n\n'
                break

            yield f"data: {json.dumps(message)}\n\n"

    return Response(
        stream_with_context(generate()),
        mimetype="text/event-stream"
    )


# Balls in a hat simulation page
@app.route("/sims/balls")
def balls():
    return render_template("sims/balls.html")

# Balls in a hat execution
@app.route("/run/balls")
def run_balls():
    number = int(request.args.get("number"))
    good = int(request.args.get("good"))
    bad = int(request.args.get("bad"))

    updates = queue.Queue()

    def callback(text, body):
        updates.put({
            "output": text,
            "body": body
        })

    def worker():
        try:
            balls_main(number, good, bad, callback)
        except Exception as e:
            updates.put({"error": str(e)})
        finally:
            updates.put(None)

    threading.Thread(target=worker, daemon=True).start()

    def generate():
        while True:
            message = updates.get()

            if message is None:
                yield 'data: {"finished": true}\n\n'
                break

            yield f"data: {json.dumps(message)}\n\n"

    return Response(
        stream_with_context(generate()),
        mimetype="text/event-stream"
    )

if __name__ == "__main__":
    app.run(debug=True, threaded=True)