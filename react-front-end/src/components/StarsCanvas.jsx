import React, { useEffect, useRef } from "react";

const StarsCanvas = ({onConnect}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if(canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
  
      const context = canvas.getContext("2d");
  
      const colors = ['white', 'orange',  'silver', '#ffdb00', '#ffa700',"#0952BD" ,"#A5BFF0", "#118CD6", "#1AAEE8", "#F2E8C9", 'white', 'white','white', 'white', 'white']
  
      const mouse = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      };
      
      const rectSizes = {
        textSize: 20,
        rectWidth: 200, 
        rectHeight: 40,
        rectX() {
          return ( window.innerWidth - this.rectWidth() ) / 2;
        }, 
        rectY() {
          return ( window.innerHeight - this.rectHeight() ) / 2;
        }
      }
  
      class Star {
        constructor(x, y, radius, color) {
          this.x = x;
          this.y = y;
          this.radius = radius;
          this.color = color;
        }
  
        draw() {
          context.beginPath();
          context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
          context.shadowColor = this.color;
          context.shadowBlur = 20;
          context.fillStyle = this.color;
          context.fill();
          context.closePath();
        }
  
        update() {
          this.draw();
        }
      }
      
      // Event Listeners
      canvas.addEventListener("mousemove", (event) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
  
        if(mouseInButton()) 
          canvas.style.cursor = 'pointer';
        else
          canvas.style.cursor = 'default';
      });
  
      canvas.addEventListener("click", (event) => {
        if(mouseInButton()) {
          onConnect();
        }
      });
  
      window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
      });
  
      let stars;
      let radians = 0;
  
      function init() {
        stars = [];
  
        for (let i = 0; i < 500; i++) {
          // To fill stars at the edges in rectangle aspect ratio
          const edgeOffset = 300;
  
          // To account for canvas translate to center
          const x = ( Math.random() - 0.5 ) * ( canvas.width + edgeOffset);
          const y = ( Math.random() - 0.5 ) * ( canvas.height + edgeOffset*2);
  
          const radius = 2.25 * Math.random();
          const color = colors[Math.floor(Math.random() * colors.length)];
          stars.push(new Star(x, y, radius, color));
        }
  
      }
  
      function mouseInButton() {
        return mouse.x > rectSizes.rectX && mouse.x < rectSizes.rectX + rectSizes.rectWidth && mouse.y > rectSizes.rectY && mouse.y < rectSizes.rectY + rectSizes.rectHeight;
      }
      
      function roundRect(context, x, y, width, height, radius, fill, stroke) {
        if (typeof stroke == "undefined" ) {
          stroke = true;
        }
        if (typeof radius === "undefined") {
          radius = 5;
        }
        context.beginPath();
        context.moveTo(x + radius, y);
        context.lineTo(x + width - radius, y);
        context.quadraticCurveTo(x + width, y, x + width, y + radius);
        context.lineTo(x + width, y + height - radius);
        context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        context.lineTo(x + radius, y + height);
        context.quadraticCurveTo(x, y + height, x, y + height - radius);
        context.lineTo(x, y + radius);
        context.quadraticCurveTo(x, y, x + radius, y);
        context.closePath();
        if (stroke) {
          context.stroke();
        }
        if (fill) {
          context.fill();
        }        
      }
  
      function drawButton(textSize) {
        context.lineWidth = 4;
        context.strokeStyle = "#000000";
        context.fillStyle = "#abc";
        rectSizes.textSize = textSize;
        rectSizes.rectWidth = textSize * 10;
        rectSizes.rectHeight = textSize * 2;
        rectSizes.rectX = canvas.width/2 - rectSizes.rectWidth/2;
        rectSizes.rectY = canvas.height/2 - rectSizes.rectHeight/2;
        roundRect(context, rectSizes.rectX, rectSizes.rectY, rectSizes.rectWidth, rectSizes.rectHeight, 15, true);
        context.font = "bold 20px Tahoma";
        context.textAlign = "center";
        context.fillStyle = "#0a97b7";
        context.textBaseline = "middle";
        context.fillText("CONNECT METAMASK", rectSizes.rectX+(rectSizes.rectWidth/2), rectSizes.rectY+(rectSizes.rectHeight/2));
      }
      
      // Animation Loop
      function animate() {
        requestAnimationFrame(animate);
        context.clearRect(0, 0, canvas.width, canvas.height);
  
        // Gradient for canvas background
        const grd = context.createLinearGradient(0, canvas.height, canvas.width, 0);
        grd.addColorStop(0, "#855988");
        grd.addColorStop(0.1, "#6B4984");
        grd.addColorStop(0.3, "#483475");
        grd.addColorStop(0.5, "#2B2F77");
        grd.addColorStop(0.7, "#141852");
        grd.addColorStop(1, "#070B34");
        context.fillStyle = grd;
        context.fillRect(0, 0, canvas.width, canvas.height);
  
        // Adding a button to connect metamask
        drawButton(context.measureText('CONNECT METAMASK').width / 8.5);
        
        // Rotating and drawing stars
        context.save();
        context.translate(canvas.width/2, canvas.height/2);
        context.rotate(radians);
        stars.forEach(star => star.update());
        context.restore();
        
        radians += 0.002;
      }
  
      init();
      animate();
    }

    
  }, );

  return (
    <canvas ref={canvasRef}/>
  )
};

export default StarsCanvas;
