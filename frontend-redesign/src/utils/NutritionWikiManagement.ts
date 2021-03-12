import { INutritionWikiItem } from './interfaces';

export class NutritionWikiManagement {
  private static items: INutritionWikiItem[] = [
    {
      category: 'Nährstoffe',
      title: 'Ballaststoffe',
      goodFor: [
        'Senken von Cholesterinspiegel',
        'Regulierung von Blutzucker',
        'Förderung der Darmbewegung'
      ],
      containedIn: [
        'Äpfe',
        'Birnen',
        'Beeren',
        'Zitrusfrüchte',
        'getrocknete Aprikosen/Pflaumen/Rosinen',
        'Vollkorn',
        'Brokkoli',
        'Erbsen',
        'Karotten',
        'Kohl',
        'Nüsse und Samen'
      ],
      thumbnail:
        'https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=5&w=1080'
    },
    {
      category: 'Nährstoffe',
      title: 'Calcium',
      goodFor: [
        'Haare, Zähne, Knochen',
        'Muskeln',
        'Nerven',
        'Blutgerinnung',
        'Entzündungen'
      ],
      containedIn: [
        'Milch',
        'grünem Gemüse (Fenchel, Brokkoli, Grünkohl, ...)',
        'Beeren',
        'Kräuter',
        'Nüsse',
        'Vollkorn',
        'Eier'
      ],
      thumbnail:
        'https://images.unsplash.com/photo-1588710929895-6ee7a0a4d155?q=5&w=1080'
    },
    {
      category: 'Nährstoffe',
      title: 'Fette/Lipide',
      general: [
        'bringen mehr als das Doppelte an Energie wie Proteine oder Kohlenhydrate',
        'gesättigte Fettsäuren: Fleisch, Butter, ...',
        'ungesättigte Fettsäuren: Pflanzenöle, Fisch, ...',
        'Trans-Fettsäure: Chips, ... --> SCHLECHT'
      ],
      thumbnail:
        'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?q=5&w=1080'
    },
    {
      category: 'Nährstoffe',
      title: 'Kohlenhydrate',
      general: [
        'komplexe Kohlenhydrate: Getreide, Vollkorn, Kartoffeln, ... --> Zucker muss erst aufgespalten werden',
        'Einfach Zucker: Frucht- und Traubenzucker',
        'Zweifachzucker: Haushalts- und Milchzucker'
      ],
      thumbnail:
        'https://images.unsplash.com/photo-1605690258824-d3ececd2741d?q=5&w=1080'
    },
    {
      category: 'Nährstoffe',
      title: 'Magnesium',
      goodFor: [
        'Muskeln',
        'Nerven',
        'Herz',
        'Knochen, Zähne',
        'Energiestoffwechsel',
        'Elektrolytgleichgewicht'
      ],
      containedIn: [
        'Vollkorn',
        'Hafer',
        'grünes Gemüse',
        'Nüsse',
        'Samen, Kerne',
        'Hülsenfrüchte'
      ],
      thumbnail:
        'https://images.unsplash.com/photo-1502747220144-846486e80891?q=5&w=1080'
    },
    {
      category: 'Nährstoffe',
      title: 'Makronährstoffe',
      general: ['Energielieferanten', 'Kohlenhydrate, Proteine, Fette'],
      thumbnail:
        'https://images.unsplash.com/photo-1532550907401-a500c9a57435?q=5&w=1080'
    },
    {
      category: 'Nährstoffe',
      title: 'Mikronährstoffe',
      general: [
        'Depots in Knochen, Zähne, Haut, Leber und Muskulatur',
        'Vitamine, Mineralstoffe, Spurenelemente'
      ],
      thumbnail:
        'https://images.unsplash.com/photo-1585307510180-2d94ee4bf0ff?q=5&w=1080'
    },
    {
      category: 'Nährstoffe',
      title: 'Omega 3',
      goodFor: [
        'Entzüdungshemmend',
        'Fließeigenschaft von Blut',
        'Blutdruck senkend',
        'Aufbau von Zellen'
      ],
      containedIn: [
        'Fisch (Lachs, Thunfisch, Forelle, Sardine, Makrele,..)',
        'Raps-, Hanf-, Lein-, Walnuss-, Chiaöl',
        'Rosenkohl',
        'Avocado',
        'Spinat',
        'Bohnen',
        'Nüsse',
        'Samen',
        'Soja'
      ],
      thumbnail:
        'https://images.unsplash.com/photo-1613744696750-4181a318e57a?q=5&w=1080'
    },
    {
      category: 'Nährstoffe',
      title: 'Präbiotika',
      goodFor: ['Darmflora', 'Immunsystem'],
      containedIn: [
        'Spargel',
        'Getreide',
        'Chicorée',
        'Topinambur',
        'Zwiebeln',
        'Knoblauch',
        'Schwarzwurzel',
        'grüne Bananen',
        'Bohnen',
        'Erbsen'
      ],
      thumbnail:
        'https://images.unsplash.com/photo-1519590350802-eb212e2ea536?q=5&w=1080'
    },
    {
      category: 'Nährstoffe',
      title: 'Probiotika',
      goodFor: ['Darmflora', 'Immunsystem'],
      containedIn: [
        'Joghurt',
        'Käse',
        'Sauerkraut',
        'Sauerteig',
        'Kefir',
        'Miso',
        'Kombucha',
        'Tempeh'
      ],
      thumbnail:
        'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?q=5&w=1080'
    },
    {
      category: 'Nährstoffe',
      title: 'Proteine/Eiweiß',
      general: ['werden nicht lange vom Körper gespeichert'],
      thumbnail:
        'https://images.unsplash.com/photo-1605291535557-4fc6bb3b4d00?q=5&w=1080'
    },
    {
      category: 'Vitamine',
      title: 'Vitamin B7 (Biotin)',
      goodFor: ['Haut, Haare, Nägel', 'Stoffwechsel'],
      containedIn: ['Eier', 'Nüsse', 'Haferflocken', 'Milch', 'Hefe', 'Leber'],
      thumbnail:
        'https://images.unsplash.com/photo-1498654077810-12c21d4d6dc3?q=5&w=1080'
    },
    {
      category: 'Vitamine',
      title: 'Vitamin B12',
      goodFor: ['Stoffwechel', 'Abbau von Fettsäuren'],
      containedIn: [
        'nur in tierischen Nahrungsmitteln, da es nur von Mikroorganismen synthetisiert werden kann'
      ],
      thumbnail:
        'https://images.unsplash.com/photo-1592768116796-f2c356806033?q=5&w=1080'
    },
    {
      category: 'Vitamine',
      title: 'Vitamin C',
      goodFor: [
        'Immunsystem',
        'Bindegewebe',
        'Botenstoffe',
        'Eisenaufnahme',
        'Zellen',
        'Haut, Zähne, Knochen'
      ],
      containedIn: [
        'Hagebutte',
        'Sanddorn',
        'Paprika',
        'Kohl',
        'Zitrusfrüchte',
        'Beeren',
        'Spinat'
      ],
      thumbnail:
        'https://images.unsplash.com/photo-1610554636863-8280b198ac7e?q=5&w=1080'
    },
    {
      category: 'Vitamine',
      title: 'Vitamin D3',
      goodFor: [
        'Kalziumaufnahme',
        'Erhalt und Aufbau von Knochen',
        'Botenstoffe',
        'Zellstoffwechsel',
        'Aufnahme über Sonnenlicht über die Haut!'
      ],
      containedIn: [
        'kaum in Nahrung, jedoch: fetthaltiger Fisch (Lachs, Aal, Makrele, Hering, ...)'
      ],
      thumbnail:
        'https://images.unsplash.com/photo-1545955413-209e03defb1f?q=5&w=1080'
    },
    {
      category: 'Vitamine',
      title: 'Vitamin K2',
      goodFor: [
        'Einlagerung von Calcium in Knochen',
        '-> Beugt Arteriosklerose (Arterienverkalkung) vor',
        '-> Beugt Osteoporose (brüchige Knochen) vor'
      ],
      containedIn: [
        'Kräuter (Kresse, Schnittlauch)',
        'grünes Blattgemüse',
        'Rinderleber',
        'Sojabohnen',
        'Hafer',
        'Vollweizen',
        'Kartoffeln',
        'Kohl'
      ],
      thumbnail:
        'https://images.unsplash.com/photo-1507727910967-9be3fdf9a009?q=5&w=1080'
    },
    {
      category: 'Supplements',
      title: 'Whey',
      general: [
        'aus Molkenprotein der Milch (natürliches Eiweiß)',
        'leicht verdaulich, kurze Resorptionszeit',
        'enthält alle unentbährlichen Aminosöuren',
        'Whey-Konzentrat: hoher Eiweißgehalt (70-78%), günstig',
        'Whey-Isolat: hoher Eiweißgehalt (90-96%), geringer Fett- und Kohlenhydrat-Anteil, laktosefrei',
        'Whey-Hydrolysat: aus Whey-Konzentrat oder -Isolat gewonnen, aufgespaltete Proteine für eine bessere Aufnahme'
      ],
      thumbnail:
        'https://images.unsplash.com/photo-1595414902678-862fe51c9f27?q=5&w=1080'
    },
    {
      category: 'Supplements',
      title: 'Casein',
      general: [
        'Milchprotein',
        'wird langsamer aufgenommen (eignet sich für Abends!)'
      ],
      thumbnail:
        'https://images.unsplash.com/photo-1565498971161-42ae3dbcca75?q=5&w=1080'
    },
    {
      category: 'Supplements',
      title: 'Kreatin',
      general: [
        'Wassereinlagerungen in den Muskeln - lassen diese praller und größer aussehen',
        'mehr Kraft und Kraftausdauer',
        'weniger Muskelschäden',
        'verkürzte Regenerationszeit',
        'Achtung: Achte darauf zusätzlich genug Flüssigkeit zu dir zu nehmen!'
      ],
      thumbnail:
        'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=5&w=1080'
    },
    {
      category: 'Supplements',
      title: 'L-Glutamin',
      general: [
        'Beschleunigung der Regenaration',
        'schnellere Wiederauffüllung der Glykogen-Speicher'
      ],
      thumbnail:
        'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=5&w=1080'
    },
    {
      category: 'Supplements',
      title: 'EAAs',
      general: [
        'essentielle Aminosäuren sich wichtg für das Immunsystem und den Stoffwechsel',
        'können nicht vom Körper hergestellt werden',
        'sind am Aufbau von Proteinen und somit an anabolen Prozessen beteiligt',
        'werden nicht genügend EAAs zugeführt, nimmt sich der Organismus dieses aus der eigenen Körpersubstanz'
      ],
      thumbnail:
        'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=5&w=1080'
    },
    {
      category: 'Supplements',
      title: 'BCAAs',
      general: [
        'essentiellen Aminosäuren Valin, Leucin, Isoleucin',
        'werden nicht über die Leber verstoffwechselt, sondern direkt über den Darm aufgenommen',
        'wichtig für die Muskelproteisynthese'
      ],
      thumbnail:
        'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=5&w=1080'
    }
  ];

  public static getByCategory(category: string): INutritionWikiItem[] {
    return this.items.filter(x => x.category === category);
  }

  public static getCategories(): string[] {
    return [...new Set(this.items.map(x => x.category))];
  }

  public static getItem(title: string): INutritionWikiItem | null {
    return (
      this.items.filter(
        x => x.title.toLowerCase() === title.toLowerCase()
      )[0] || null
    );
  }
}
