# FlickIt
## IDCM - Identity, Determination, Mind, Community

## Gioco Riabilitativo per Pazienti con SLA

Questo progetto consiste nella **creazione di un videogioco riabilitativo pensato per persone affette da SLA (Sclerosi Laterale Amiotrofica)**.

L’obiettivo principale del gioco è **favorire la riabilitazione motoria e cognitiva**, aiutando i pazienti a mantenere attivi sia il movimento della mano sia le capacità mentali, attraverso un’esperienza ludica semplice, accessibile e progressiva.

Questo file README rappresenta una **documentazione iniziale**, che verrà ampliata e completata durante lo sviluppo del progetto.

---

## Obiettivi del progetto

* Stimolare il **movimento controllato della mano**
* Allenare la **memoria e il ragionamento matematico**
* Offrire un’esperienza di gioco **inclusiva e accessibile**
* Utilizzare tecnologie di **computer vision** per ridurre l’uso di dispositivi fisici
* Adattare la difficoltà attraverso **livelli progressivi**

---

## Tecnologie utilizzate

* **p5.js** per lo sviluppo del gioco
* **ml5.js** : libreria di machine learning per JavaScript che permette il riconoscimento della mano tramite webcam, consentendo di utilizzare i movimenti e la chiusura della mano come sistema di controllo
  all’interno del gioco
  tecnologie di Ml5.js :
  **handtracking**: permette di tracciare diversi punti della mano
  **facemesh**: permette di tracciare diversi punti del viso tra cui la punta del naso che abbiamo utilizzato all'interno del codice 

L’interazione con il gioco avviene **con mouse o tastiera** ed anche tramite **la mano** dell’utente.

---

## Modalità di interazione

Il gioco utilizza la **fotocamera** del dispositivo per rilevare la mano dell’utente.

Attraverso la creazione e l’analisi di **punti di riferimento sulla mano**, il sistema è in grado di:

* Riconoscere la posizione della mano sullo schermo
* Capire quando la mano è **aperta** o **chiusa**

La **chiusura della mano** viene interpretata come un **click**, permettendo all’utente di interagire con il gioco in modo naturale e intuitivo.

---

## Gioco: Memory matematico

Il primo gioco è una versione riabilitativa del classico **gioco del memory con carte**.

### Descrizione

* Le carte sono inizialmente coperte
* Girando una carta appare un **calcolo matematico** (ad esempio: `5 + 8`)
* L’obiettivo è trovare un’altra carta con **un calcolo diverso ma con lo stesso risultato**
* Le coppie corrette vengono tolte dal tavolo ed appare una talpa in una posizione casuale
* Quando il cursore è sopra la talpa e la mano si chiude, la talpa viene colpita
* L’utente deve colpire la talpa utilizzando la mano per ottenere più punti
* Se invece si ignora la talpa, scompare se si continua a giocare a Memory, uscirà una nuova talpa trovando una nuova coppia 
* Il gioco termina quando tutte le coppie sono state abbinate

Questo gioco permette di allenare:

* Memoria visiva
* Capacità di calcolo
* Coordinazione mano-occhio
* Prontezza di riflessi
* Coordinazione
* Controllo del movimento

### Livelli del memory

* **Livello 1**: 10 carte (difficoltà bassa)
* **Livello 2**: 20 carte (difficoltà media)
* **Livello 3**: 30 carte (difficoltà alta)

### Interazione

* L’utente sposta la mano sopra una carta
* Un cursore indica quando la mano è sopra una carta selezionabile
* Chiudendo la mano, la carta viene girata

## Stato del progetto

Il progetto è **in fase di sviluppo**.

Il codice, le funzionalità e la documentazione verranno aggiornati progressivamente durante il lavoro.

---
## Note finali

Questo progetto ha uno scopo **educativo e riabilitativo**.

L’idea è quella di dimostrare come la programmazione e le tecnologie interattive possano essere utilizzate per creare strumenti utili nel supporto alle persone con disabilità motorie.

---

## Contatti
### Sito del progetto

Sito ufficiale: [https://carlottabruno.github.io/]

---

### Team di sviluppo

#### Isabel Ciartano
* GitHub: @IsabelCiartano
* Instagram: @isabelciartano
* Email: isabel.ciartano@itiscuneo.edu.it

#### Carlotta Bruno
* GitHub: @carlottabruno
* Instagram: @carlottabruno
* Email: carlotta.bruno@itiscuneo.edu.it

#### Matteo Solare
* GitHub: @matteosolare
* Instagram: @_mattesolare_
* Email: matteo.solare@itiscuneo.edu.it

#### Dionyz Picollo
* GitHub: @JJpaicols
* Instagram: @not.did0
* Email: dionyz.picollo@itiscuneo.edu.it

#### Per collaborazioni, informazioni o supporto è possibile contattare il team attraverso uno dei riferimenti sopra indicati.
