
function drawBallsGraph(vytiahnutia) {
    const canvas = document.getElementById("graphCanvas");

    if (!canvas) {
        console.error("graphCanvas not found!");
        return;
    }

    const ctx = canvas.getContext("2d");

    const total = vytiahnutia.length;

    const good = vytiahnutia.filter(ball => ball.type === true).length;
    const bad = total - good;

    const values = [
        total > 0 ? good / total * 100 : 0,
        total > 0 ? bad / total * 100 : 0
    ];

    const labels = ["Dobré guličky", "Zlé guličky"];
    const colors = ["green", "red"];

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const margin = 50;
    const graphHeight = canvas.height - 2 * margin;

    const barWidth = 100;
    const positions = [120, 300];

    // Axes
    ctx.beginPath();
    ctx.moveTo(margin, margin);
    ctx.lineTo(margin, canvas.height - margin);
    ctx.lineTo(canvas.width - margin, canvas.height - margin);
    ctx.strokeStyle = "black";
    ctx.stroke();

    // Y-axis percentages
    ctx.textAlign = "right";
    ctx.fillStyle = "black";

    for (let percent = 0; percent <= 100; percent += 20) {
        const y = canvas.height - margin - percent / 100 * graphHeight;

        ctx.fillText(percent + "%", margin - 10, y + 5);

        // Grid lines
        ctx.beginPath();
        ctx.moveTo(margin, y);
        ctx.lineTo(canvas.width - margin, y);
        ctx.strokeStyle = "#dddddd";
        ctx.stroke();
    }

    // Draw bars
    values.forEach((value, i) => {
        const barHeight = value / 100 * graphHeight;
        const x = positions[i];
        const y = canvas.height - margin - barHeight;

        ctx.fillStyle = colors[i];
        ctx.fillRect(x, y, barWidth, barHeight);

        // Percentage above bar
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText(value.toFixed(1) + "%", x + barWidth / 2, y - 10);

        // Labels
        ctx.fillText(labels[i], x + barWidth / 2, canvas.height - margin + 20);
    });
}


function runProgram() {
    const number = document.getElementById("number").value;
    const good = document.getElementById("good").value;
    const bad = document.getElementById("bad").value;

    const source = new EventSource(
        "/run/balls?number=" + encodeURIComponent(number) +
        "&good=" + encodeURIComponent(good) +
        "&bad=" + encodeURIComponent(bad)
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

        document.getElementById("output").textContent = data.output;

        // Correct function name
        drawBallsGraph(data.body);
    };

    source.onerror = function() {
        source.close();
    };
}