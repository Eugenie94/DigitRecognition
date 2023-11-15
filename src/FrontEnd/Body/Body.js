import React, { useEffect, useRef } from 'react'
import './Body.css'


export default function Body() {
  const canvasRef = useRef(null)

  /* UseEffect pour la gestion de l'événement de dessin */
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    let isDrawing = false
    function startDrawing(e) {
      isDrawing = true
      draw(e)
    }

    function stopDrawing() {
      isDrawing = false
      context.beginPath()
    }

    function draw(e) {
      if (!isDrawing) return

      const mouseX = e.clientX - context.canvas.offsetLeft
      const mouseY = e.clientY - context.canvas.offsetTop
      /*Taille, contour, et de la couleur du stylo */
      context.lineWidth = 30
      context.lineCap = 'round'
      context.strokeStyle = '#000'

      context.lineTo(mouseX, mouseY)
      context.stroke()
      context.beginPath()
      context.moveTo(mouseX, mouseY)
    }

    function handleKeyDown(e) {
      /* Conditions permettant de supprimer le manuscrit avec CTRL+Z */
      if (e.ctrlKey && e.key === 'z') {
        context.clearRect(0, 0, canvas.width, canvas.height)
      }
    }

    canvas.addEventListener('mousedown', startDrawing)
    canvas.addEventListener('mouseup', stopDrawing)
    canvas.addEventListener('mousemove', draw)

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      /*  Nettoie les écouteurs d'événements lorsqu'on démonte le composant*/
      canvas.removeEventListener('mousedown', startDrawing)
      canvas.removeEventListener('mouseup', stopDrawing)
      canvas.removeEventListener('mousemove', draw)

      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [canvasRef])

  return (
    <div>
      <div className="container">
        <div className="zone-manuscrit">
          <div className="manuscrit-card">
            <div className="manuscrit-column">
              <h1 className="saisie">OCR manuscrit</h1>
              <canvas
                className="manuscrit-canvas"
                width={500}
                height={300}
                ref={canvasRef}
              ></canvas>
                <button className='rest'>Reset</button>
            </div>
            <div className="manuscrit-column">
              <h1 className="saisie">Prédiction</h1>
              <canvas
                className="manuscrit-canvas"
                width={500}
                height={300}
              ></canvas>
              <button className='predire'>Prédire</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
