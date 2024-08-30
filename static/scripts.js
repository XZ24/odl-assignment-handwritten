var canvas, ctx;
var mouseX, mouseY, mouseDown = 0;
var touchX, touchY;
var barChart1, barChart2, barChart3;
var confidencePercentages = Array(10).fill(0);
var debounceTimeout;

function init() {
    canvas = document.getElementById('sketchpad');
    ctx = canvas.getContext('2d');
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (ctx) {
        canvas.addEventListener('mousedown', sketchpad_mouseDown, false);
        canvas.addEventListener('mousemove', sketchpad_mouseMove, false);
        window.addEventListener('mouseup', sketchpad_mouseUp, false);
        canvas.addEventListener('touchstart', sketchpad_touchStart, false);
        canvas.addEventListener('touchmove', sketchpad_touchMove, false);
    }
}

// Draw function to draw on canvas
function draw(ctx, x, y, size, isDown) {
    if (isDown) {
        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.lineWidth = '15';
        ctx.lineJoin = ctx.lineCap = 'round';
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(function() {
            predict_1();
            predict_2();
            predict_3();
        }, 100);
    }
    lastX = x;
    lastY = y;
}

// Event handlers
function sketchpad_mouseDown() {
    mouseDown = 1;
    draw(ctx, mouseX, mouseY, 12, false);
}

function sketchpad_mouseUp() {
    mouseDown = 0;
}

function sketchpad_mouseMove(e) {
    getMousePos(e);
    if (mouseDown == 1) {
        draw(ctx, mouseX, mouseY, 12, true);
    }
}

function getMousePos(e) {
    if (!e)
        var e = event;
    if (e.offsetX) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    } else if (e.layerX) {
        mouseX = e.layerX;
        mouseY = e.layerY;
    }
}

function sketchpad_touchStart() {
    getTouchPos();
    draw(ctx, touchX, touchY, 12, false);
    event.preventDefault();
}

function sketchpad_touchMove(e) {
    getTouchPos(e);
    draw(ctx, touchX, touchY, 12, true);
    event.preventDefault();
}

function getTouchPos(e) {
    if (!e)
        var e = event;
    if (e.touches) {
        if (e.touches.length == 1) {
            var touch = e.touches[0];
            touchX = touch.pageX - touch.target.offsetLeft;
            touchY = touch.pageY - touch.target.offsetTop;
        }
    }
}

function predict_1() {
    var imageData = canvas.toDataURL();
    fetch('/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image_data: imageData })
    })
    .then(response => response.json())
    .then(data => {
        updateChart1(data.results);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function predict_2() {
    var imageData = canvas.toDataURL();
    fetch('/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image_data: imageData })
    })
    .then(response => response.json())
    .then(data => {
        updateChart2(data.results);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function predict_3() {
    var imageData = canvas.toDataURL();
    fetch('/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image_data: imageData })
    })
    .then(response => response.json())
    .then(data => {
        updateChart3(data.results);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Clear canvas function
document.getElementById('clear_button').addEventListener("click",
    function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    });

// Update Chart 1
function updateChart1(confidenceArray) {
    if (!barChart1) {
        var chartData = {
            labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
            datasets: [{
                label: 'Confidence Percentage (Chart 1)',
                backgroundColor: confidenceArray.map((confidence, index) => {
                    return generateColor(index);
                }),
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                data: confidenceArray.map(confidence => confidence * 100)
            }]
        };

        var chartOptions = {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        min: 0,
                        max: 100,
                        callback: function(value) {
                            return value + '%'; 
                        }
                    }
                }]
            }
        };
        barChart1 = new Chart(document.getElementById('barChart1'), {
            type: 'bar',
            data: chartData,
            options: chartOptions
        });
    } else {
        barChart1.data.datasets[0].data = confidenceArray.map(confidence => confidence * 100);
        barChart1.data.datasets[0].backgroundColor = confidenceArray.map((confidence, index) => {
            return generateColor(index);
        });
        barChart1.update();
    }
}

// Update Chart 2
function updateChart2(confidenceArray) {
    if (!barChart2) {
        var chartData = {
            labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
            datasets: [{
                label: 'Confidence Percentage (Chart 2)',
                backgroundColor: confidenceArray.map((confidence, index) => {
                    return generateColor(index);
                }),
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                data: confidenceArray.map(confidence => confidence * 100)
            }]
        };

        var chartOptions = {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        min: 0,
                        max: 100,
                        callback: function(value) {
                            return value + '%'; 
                        }
                    }
                }]
            }
        };
        barChart2 = new Chart(document.getElementById('barChart2'), {
            type: 'bar',
            data: chartData,
            options: chartOptions
        });
    } else {
        barChart2.data.datasets[0].data = confidenceArray.map(confidence => confidence * 100);
        barChart2.data.datasets[0].backgroundColor = confidenceArray.map((confidence, index) => {
            return generateColor(index);
        });
        barChart2.update();
    }
}

// Update Chart 3
function updateChart3(confidenceArray) {
    if (!barChart3) {
        var chartData = {
            labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
            datasets: [{
                label: 'Confidence Percentage (Chart 3)',
                backgroundColor: confidenceArray.map((confidence, index) => {
                    return generateColor(index);
                }),
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                data: confidenceArray.map(confidence => confidence * 100)
            }]
        };

        var chartOptions = {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        min: 0,
                        max: 100,
                        callback: function(value) {
                            return value + '%'; 
                        }
                    }
                }]
            }
        };
        barChart3 = new Chart(document.getElementById('barChart3'), {
            type: 'bar',
            data: chartData,
            options: chartOptions
        });
    } else {
        barChart3.data.datasets[0].data = confidenceArray.map(confidence => confidence * 100);
        barChart3.data.datasets[0].backgroundColor = confidenceArray.map((confidence, index) => {
            return generateColor(index);
        });
        barChart3.update();
    }
}

function generateColor(number) {
    var colors = [
        'rgba(255, 99, 132, 0.5)',   // Red
        'rgba(54, 162, 235, 0.5)',   // Blue
        'rgba(255, 206, 86, 0.5)',   // Yellow
        'rgba(75, 192, 192, 0.5)',   // Green
        'rgba(153, 102, 255, 0.5)',  // Purple
        'rgba(255, 159, 64, 0.5)',   // Orange
        'rgba(255, 99, 132, 0.5)',   // Red
        'rgba(54, 162, 235, 0.5)',   // Blue
        'rgba(255, 206, 86, 0.5)',   // Yellow
        'rgba(75, 192, 192, 0.5)'    // Green
    ];
    return colors[number % colors.length];
}

document.addEventListener("DOMContentLoaded", function() {
    init();
    updateChart1(confidencePercentages);
    updateChart2(confidencePercentages);
    updateChart3(confidencePercentages);
});
