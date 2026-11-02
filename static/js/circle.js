
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

function drawCanvas(body) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Circle
    ctx.beginPath();
    ctx.arc(200, 200, 200, 0, 2 * Math.PI);
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Points
    for (const point of body) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = point.inside ? "green" : "red";
        ctx.fill();
    }
}

function runProgram() {
    const number = document.getElementById("number").value;

    if (!number || Number(number) < 1) {
        document.getElementById("output").textContent =
            "Zadaj kladný počet pokusov.";
        return;
    }

    document.getElementById("output").textContent = "";

    const source = new EventSource(
        "/run/circle?number=" + encodeURIComponent(number)
    );

    source.onmessage = function(event) {
        const data = JSON.parse(event.data);

        if (data.finished) {
            source.close();
            return;
        }

        if (data.error) {
            document.getElementById("output").textContent = data.error;
            source.close();
            return;
        }

        // Replace previous output
        document.getElementById("output").textContent = data.output;

        // Update canvas
        drawCanvas(data.body);
    };

    source.onerror = function() {
        document.getElementById("output").textContent =
            "Chyba pri komunikácii so serverom.";
        source.close();
    };
}
