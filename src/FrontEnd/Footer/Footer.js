import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faTrello } from '@fortawesome/free-brands-svg-icons';
import './Footer.css'

export default function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-column">
          <a
            href=" https://github.com/Eugenie94/DigitRecognition.git"
            target="_blank"
            rel="noopener noreferrer"
          >
        <FontAwesomeIcon icon={faGithub} size="5x" color="white" className='icone' />
          
          </a>
        </div>
        <div className="footer-column">
          <a
            href="https://trello.com/b/eXJDdxGh/projet-ia"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faTrello} size="5x" color="white" className='icone' />
          </a>
          
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer">
          Tous droits réservés &copy; 2023 Projet annuel. |Politique de
          confidentialité |Conditions d'utilisation
        </p>
      </div>
    </footer>
  )
}
