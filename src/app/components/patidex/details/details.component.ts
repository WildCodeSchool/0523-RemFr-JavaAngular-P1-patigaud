import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnChanges {
  @Input() details: any;
  @Input() opened!: boolean;
  @Input() index: any
  public generatedParagraph: string = '';

  @Output() close: EventEmitter<number> = new EventEmitter<number>();


  ngOnChanges(changes: SimpleChanges) {
    if (changes["opened"] && changes["opened"].currentValue) {
      this.generateParagraph();
    }
  }

  generateParagraph() {
    const adjectives = ['magnifique', 'luxuriant', 'fleuri', 'parfumé', 'verdoyant'];
    const verbs = ['cultiver', 'arroser', 'planter', 'entretenir', 'admirer'];
    const nouns = ['fleurs', 'arbres', 'arbustes', 'légumes', 'herbes'];
    const locations = ['dans le jardin avant', 'dans le jardin arrière', 'dans le patio', 'sur la terrasse', 'dans les parterres'];

    const nbParagraph = 1;
    const minPhrase = 1;
    const maxPhrase = 2;

    let paragraph = '';

    for (let i = 0; i < nbParagraph; i++) {
      const phraseLength = Math.floor(
        Math.random() * (maxPhrase - minPhrase + 1) + minPhrase
      );
      let phrase = '';

      for (let j = 0; j < phraseLength; j++) {
        const randomAdjectives = adjectives[Math.floor(Math.random() * adjectives.length)];
        const randomVerbs = verbs[Math.floor(Math.random() * verbs.length)];
        const randomNouns = nouns[Math.floor(Math.random() * nouns.length)];
        const randomLocation = locations[Math.floor(Math.random() * locations.length)];

        phrase += `des ${randomNouns} ${randomAdjectives} que l'on peut ${randomVerbs} ${randomLocation}, `;
      }

      phrase = phrase.trim().slice(0, -1) + '. ';
      paragraph += phrase;
    }
    this.generatedParagraph = paragraph;
  }

  onClose() {
    this.close.emit(this.index);
  }

}
