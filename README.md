# FlickIt
## IDCM - Identity, Determination, Mind, Community

---

### Project Website

Official website: [https://carlottabruno.github.io/]
Official Game: [https://isabelciartano.github.io/Flick_It/]

---

## Rehabilitation Game for ALS Patients

This project consists of the **creation of a rehabilitation videogame designed for people affected by ALS (Amyotrophic Lateral Sclerosis)**.

The main objective of the game is **to promote motor and cognitive rehabilitation**, helping patients keep both hand movement and mental abilities active, through a simple, accessible and progressive gaming experience.

This README file represents **initial documentation**, which will be expanded and completed during the development of the project.

---

## Project Objectives

* Stimulate **controlled hand movement**
* Train **memory and mathematical reasoning**
* Offer an **inclusive and accessible** gaming experience
* Use **computer vision** technologies to reduce the use of physical devices
* Adapt difficulty through **progressive levels**

---

## Technologies Used

* **p5.js** for game development
* **ml5.js** : machine learning library for JavaScript that enables hand recognition via webcam, allowing movements to be used as a control system within the game.
  * ml5.js technologies:
  **handtracking**: allows tracking of various hand landmarks.
  **facemesh**: allows tracking of various facial landmarks including the nose tip which we used within the code.

Interaction with the game occurs **with mouse or keyboard** and also via the user's **hand**.

---

## Interaction Modes

The game uses the device's **camera** to detect the user's hand.

Through the creation and analysis of **reference points on the hand**, the system is able to:

* Recognize the position of the hand on the screen
* Understand when the hand is **open** or **closed**

The **closing of the hand** is interpreted as a **click**, allowing the user to interact with the game in a natural and intuitive way.

In another mode selectable before the game begins, the nose can be used as a cursor.
If the nose stays still for a total amount of time the card flips, same function for hitting the mole.

---

## Game: Math Memory

The first game is a rehabilitative version of the classic **memory card game** combinated with **catch the mole**.

### Description

* The cards are initially face down
* Flipping a card reveals a **mathematical expression** (for example: `5 + 8`)
* The objective is to find another card with **a different expression but with the same result**
* Correct pairs are removed from the table and a mole appears in a random position
* When the cursor is over the mole and the hand closes, the mole is hit
* The user must hit the mole using the hand to earn more points
* If the mole is ignored instead, it disappears if you continue playing Memory, a new mole will appear when a new pair is found
* The game ends when all pairs have been matched

This game allows training of:

* Visual memory
* Calculation skills
* Hand-eye coordination
* Reflex speed
* Coordination
* Movement control

### Game Levels

* **Level 1**: 4 cards and 2 moles (low difficulty)
* **Level 2**: 6 cards and 3 moles (medium difficulty)
* **Level 3**: 10 cards and 5 moles (high difficulty)

### Interaction

* The user moves the hand over a card
* A cursor indicates when the hand is over a selectable card
* By closing the hand, the card is flipped
* Through another mode the nose can be used as a cursor

## Project Status

The project has been successfully completed.

The game is now fully developed, tested, and ready to be presented and distributed as a rehabilitative support tool designed to assist people with ALS. It is available for use and aims to provide accessible motor and cognitive training through interactive gameplay.

---

## Final Notes

This project has an **educational and rehabilitative** purpose.

The idea is to demonstrate how programming and interactive technologies can be used to create useful tools in supporting people with motor disabilities.

---
### Test User Video

A folder named **"Test User Video"** has been created inside the project repository.

This folder contains a screen recording that demonstrates the full functionality of the game in both interaction modes: hand tracking control and face tracking control. The video shows how users can interact with the Memory game and the Whack-a-Mole game using either their hand gestures or facial movements detected through the camera.

The purpose of this video is to provide a clear demonstration of the system’s usability, accessibility, and real-time interaction features.

For any questions or further information, please refer to the Contacts section above.

<video src= "https://res.cloudinary.com/dqt3dxskr/video/upload/v1771588951/testuservideo_ak3fjw.mp4" controls width="640"></video>

--- 

### Development Team

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

#### For collaborations, information or support it is possible to contact the team through one of the references listed above.
