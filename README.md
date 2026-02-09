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
* **Librerie di hand tracking** integrate con p5 per il riconoscimento della mano tramite webcam
* **Computer vision** per il rilevamento dei movimenti e dei gesti

L’interazione con il gioco avviene **senza mouse o tastiera**, ma esclusivamente tramite la mano dell’utente.

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
* Le coppie corrette restano scoperte
* Il gioco termina quando tutte le coppie sono state abbinate

* Sullo schermo sono presenti dei **buchi** intorno al tavolo rappresentato
* La talpa esce casualmente dai buchi
* L’utente deve colpire la talpa utilizzando la mano
* Quando il cursore è sopra la talpa e la mano si chiude, la talpa viene colpita

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
