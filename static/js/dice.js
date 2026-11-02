document.addEventListener("DOMContentLoaded", function () {
    const diceButtons = document.querySelectorAll(".dice-face");
    const sidesInput = document.getElementById("sides");

    diceButtons.forEach(button => {
        button.addEventListener("click", function () {

            // Remove selection from all buttons
            diceButtons.forEach(b => b.classList.remove("selected"));

            // Select clicked button
            this.classList.add("selected");

            // Save selected number of sides
            sidesInput.value = this.dataset.sides;

            // Update maximum value of the asked input
            document.getElementById("asked").max = sidesInput.value;
        });
    });
});

function drawDiceGraph(rolls) {
    const canvas = document.getElementById("graphCanvas");

    if (!canvas) {
        console.error("graphCanvas not found!");
        return;
    }

    const ctx = canvas.getContext("2d");

    const sides = parseInt(document.getElementById("sides").value);
    const asked = parseInt(document.getElementById("asked").value);
    const total = rolls.length;

    // Calculate probabilities
    const values = Array.from({ length: sides }, (_, i) => {
        return total > 0
            ? rolls.filter(roll => roll.value === i + 1).length / total * 100
            : 0;
    });

    const labels = Array.from({ length: sides }, (_, i) => i + 1);
    const colors = labels.map(i => i === asked ? "green" : "steelblue");

    // Graph dimensions
    const marginLeft = 50;
    const marginRight = 20;
    const marginTop = 35;
    const marginBottom = 45;

    const graphWidth = canvas.width - marginLeft - marginRight;
    const graphHeight = canvas.height - marginTop - marginBottom;

    const slotWidth = graphWidth / sides;
    const barWidth = Math.min(35, slotWidth * 0.65);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Axes
    ctx.beginPath();
    ctx.moveTo(marginLeft, marginTop);
    ctx.lineTo(marginLeft, canvas.height - marginBottom);
    ctx.lineTo(canvas.width - marginRight, canvas.height - marginBottom);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Y-axis percentages and grid lines
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.font = "12px Arial";
    ctx.fillStyle = "black";

    for (let percent = 0; percent <= 100; percent += 20) {
        const y = canvas.height - marginBottom - percent / 100 * graphHeight;

        ctx.fillText(percent + "%", marginLeft - 8, y);

        ctx.beginPath();
        ctx.moveTo(marginLeft, y);
        ctx.lineTo(canvas.width - marginRight, y);
        ctx.strokeStyle = "#dddddd";
        ctx.stroke();
    }

    // Draw bars
    values.forEach((value, i) => {
        const barHeight = value / 100 * graphHeight;

        const x = marginLeft + i * slotWidth + (slotWidth - barWidth) / 2;
        const y = canvas.height - marginBottom - barHeight;

        // Bar
        ctx.fillStyle = colors[i];
        ctx.fillRect(x, y, barWidth, barHeight);

        // Percentage above bar
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.font = sides >= 10 ? "10px Arial" : "12px Arial";

        if (value > 0) {
            ctx.fillText(value.toFixed(1) + "%", x + barWidth / 2, y - 4);
        }

        // Number below bar
        ctx.textBaseline = "top";
        ctx.fillText(labels[i], x + barWidth / 2, canvas.height - marginBottom + 8);
    });
}

function runProgram() {
    const number = document.getElementById("number").value;
    const sides = document.getElementById("sides").value;
    const asked = document.getElementById("asked").value;

    const source = new EventSource(
        "/run/dice?number=" + encodeURIComponent(number) +
        "&sides=" + encodeURIComponent(sides) +
        "&asked=" + encodeURIComponent(asked)
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
        drawDiceGraph(data.body);
    };

    source.onerror = function() {
        source.close();
    };
}