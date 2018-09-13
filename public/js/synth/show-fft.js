import { router } from "../router/router.js";

function setupAnalyser(context, source) {
    let analyser = context.createAnalyser();
    source.connect(analyser);

    analyser.fftSize = Math.pow(2,14);
    let bufferLength = analyser.frequencyBinCount;

    let canvas = document.getElementById("oscilloscope");
    let d = 512;
    canvas.width = d;
    canvas.height = d;

    let keepDrawing = false;

    function draw() {
        let dataArray = new Float32Array(bufferLength);
        analyser.getFloatFrequencyData(dataArray);

        // transparently clear the canvas
        canvas.width = d;
        canvas.height = d;
        let ctx = canvas.getContext("2d");

        let barWidth = (canvas.width / bufferLength) * 2.5;
        let posX = 0, barHeight, i;
        for (i = 0; i < bufferLength; i++) {
            barHeight = -dataArray[i];
            ctx.fillStyle = 'rgba(0,0,0)';
            ctx.fillRect(posX, barHeight*2, barWidth, d);
            posX += barWidth + 1;
        }

        // "why not request animation frame?" because I don't
        // want this to run as fast as possible. Running it as
        // fast as possible ends up clogging CG like mad.
        if (keepDrawing) setTimeout(draw, 50);
    }

    let controller = {
        notes: 0,
        onNoteOn: (note, velocity) => {
            controller.notes++;
            if (keepDrawing === false) {
                keepDrawing = true;
                draw();
                canvas.classList.remove('fadeout');
            }
        },
        onNoteOff: (note) => {
            controller.notes--;
            if(controller.notes === 0) {
                keepDrawing = false;
                canvas.classList.add('fadeout');
            }
        }
    }

    router.addListener(controller, "noteon");
    router.addListener(controller, "noteoff");
  }

  export { setupAnalyser };
