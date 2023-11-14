import React, { useEffect, useRef } from 'react'
import './Body.css'


export default function Body() {
  const canvasRef1 = useRef(null)

  /* UseEffect pour la gestion de l'événement de dessin */
  useEffect(() => {
    const canvas1 = canvasRef1.current
    const context1 = canvas1.getContext('2d')
    let isDrawing = false
    function startDrawing(e) {
      isDrawing = true
      draw(e)
    }

    function stopDrawing() {
      isDrawing = false
      context1.beginPath()
    }

    function draw(e) {
      if (!isDrawing) return

      const mouseX = e.clientX - context1.canvas.offsetLeft
      const mouseY = e.clientY - context1.canvas.offsetTop

      context1.lineWidth = 5
      context1.lineCap = 'round'
      /*style de la couleur du stylo */
      context1.strokeStyle = '#000'

      context1.lineTo(mouseX, mouseY)
      context1.stroke()
      context1.beginPath()
      context1.moveTo(mouseX, mouseY)
    }

    function handleKeyDown(e) {
      /* Conditions permettant de supprimer le manuscrit avec CTRL+Z */
      if (e.ctrlKey && e.key === 'z') {
        context1.clearRect(0, 0, canvas1.width, canvas1.height)
      }
    }

    canvas1.addEventListener('mousedown', startDrawing)
    canvas1.addEventListener('mouseup', stopDrawing)
    canvas1.addEventListener('mousemove', draw)

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      /*  Nettoie les écouteurs d'événements lorsqu'on démonte le composant*/
      canvas1.removeEventListener('mousedown', startDrawing)
      canvas1.removeEventListener('mouseup', stopDrawing)
      canvas1.removeEventListener('mousemove', draw)

      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [canvasRef1])

  return (
    <div>
      <div className="container">
        <div className="zone-manuscrit">
          <div className="manuscrit-card">
            <div className="manuscrit-column">
              <h1 className="saisie">OCR Zone d'écriture en manuscrit</h1>
              <canvas
                className="manuscrit-canvas"
                width={500}
                height={300}
                ref={canvasRef1}
              ></canvas>
            </div>
            <div className="manuscrit-column">
              <h1 className="saisie">Prédiction</h1>
              <canvas
                className="manuscrit-canvas"
                width={500}
                height={300}
              ></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
