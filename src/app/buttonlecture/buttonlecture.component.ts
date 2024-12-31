import { Component } from '@angular/core';
import { SocketService } from '../socket.service'; // Assurez-vous que le service WebSocket est bien importé
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-buttonlecture',
  templateUrl: './buttonlecture.component.html',
  styleUrls: ['./buttonlecture.component.css']
})
export class ButtonlectureComponent {
  isModalVisible: boolean = false;  // Contrôle l'affichage du modal
  cardUID: string = '';  // UID de la carte à afficher

  constructor(private websocketService: SocketService) {}

  ngOnInit() {
    // Connecter le service WebSocket
    this.websocketService.connect('ws://localhost:3000');  // URL de votre serveur WebSocket

    // Écouter les messages reçus du serveur
    this.websocketService.getMessages().subscribe((message) => {
      console.log('Message reçu:', message);
      
      if (message.uid) {
        this.cardUID = message.uid;  // Assurez-vous que l'UID est bien récupéré
        this.isModalVisible = true;  // Afficher le modal
      } else {
        console.log(message.message); // Message d'erreur si l'UID n'est pas trouvé
      }
    });
  }

  // Méthode pour afficher/masquer le modal
  toggleModal() {
    this.isModalVisible = !this.isModalVisible;  // Inverser la visibilité du modal
  }

  // Méthode pour fermer le modal
  closeModal() {
    this.isModalVisible = false;
  }
}
