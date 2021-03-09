

# Cahier des Charges Geny

Le document suivent est la documentation technique de Geny, il comprend des explication de ses fonctionnalité, de la façon dont les différentes partie communiquent, les guide de style pour le code et autres .. 

## Sommaire

1. Introduction
2. Jeu de Rôle
3. Cahier des charges

## 1. Introduction

Geny est une plateforme de Jeu de Rôle (appelé JdR dans ce document). Cette plateforme permet a plusieurs groupes de joueurs de jouer entre eux sur Internet, le simple principe de Geny est donc de créer une plateforme pouvant offrir les même possibilité que de simples table, dés, feuille et crayons, tout en amenant de nouvelle possibilités telles que la gestion de l'ambiance sonore, l'envoie d'image, gestion automatisé de plusieurs aspect d'une partie (voir chapitre ***!!!*** pour voir la totalité des fonctionnalité)

## 2. Jeu de rôle

Ce chapitre est consacré a une courte introduction au JdR, des connaissances nécessaires pour bien se comprendre.

Le Jeu de Rôle est, a la base, un jeu de plateau, qui se joue en général de 3 a 5 mais qui peut prendre de nombreuses formes, et ampleurs, ici nous allons nous contenter de la forme la plus commune, et celle qui est visé pour Geny : le JdR papier

Comme son nom l'indique plutôt bien, le jeu se joue sur feuille, avec donc table, crayons, dés, chaises et accessoires extravagants

Toutes les information sont : soit sur des feuille, pour être retenues, soit dans la tête du Maitre du Jeu ou des Joueurs

Maitres du Jeu et Joueurs sont les deux types de de .. joueurs .. jouant au .. jeu. Une partie normale compte un MJ (Maitre du Jeu) et un ou plusieurs PJ(s)(Personnage Joueurs), ces abréviation seront souvent utilisés pour les décrire. Ils ont chacun leurs rôles : le MJ est celui qui dirige le jeu, et l'univers dans lequel sont plongés les PJs

C'est le MJ qui va déterminer comment les actions se passent, quels évènements surviennent, c'est souvent le créateur de l'univers

Les PJ, eux vont jouer, réagir aux évènements par des actions et donc créer leur histoire dans le monde du MJ

Ce monde n'existe que dans la tête, et sollicite donc beaucoup d'imagination, ce qui est un point clé du jeu

Un autre point clé sont les règles de jeu, en réalité, Il n'existe pas une seul règle de jeu, il en existe beaucoup, et beaucoup sont dérivé les unes des autres

Par exemple, j'ai créé mes règles de jeu pour Geny, elles sont particulièrement adapté pour être utilisé sur Geny, en utilisant toutes les nouvelles possibilité de l'informatique

Pour plus d'info et mieux comprendre ces règles, j'ai créé GenySpil (spil dérivé arbitraire de spiel en allemand qui veut dire jeu/jouer, et donc .. enfin faut pas chercher c'est venu tout seul)

Je pense avoir résumé assez succinctement ce qu'est le Jeu de Rôle : une jeu de société pour nerds inadapté

## 3. Cahier des Charges

Ce chapitre va détailler tout ce qui est a savoir sur Geny

### 3.1 Fonctionnalités

Geny dans sa version finale sera sensé avoir ces fonctionnalités

Le sujet et la présentation étant intensément pompeux, j'ai mis en **gras** les fonctionnalité les plus importantes

* **Création de partie**
  
  * Donner un nom a la partie (requis)
  * Choix d'un mot de passe d'accès pour Maitre du Jeu (requis)
  * Choix d'un mot de passe d'accès pour Personnage Joueur (requi)
  * **Personnalisation de la partie et des règles de jeu**
    * Personnaliser le model d'attributs (voir chapitre ***!!!*** pour plus d'info)
      * **Choisir un model parmi des presets (GenySpil, DnD, etc...)**
      * Possibilité de le créer ou editer un preset au format `JSON`
    * Possibilité de choisir un thème (style CSS)
      * **choisir un thème parmis des presets**
      * Possibilité de créer ou éditer un thème en `CSS`
    * Possibilité de définir des paramètres "overwritant" les paramètres par défaut des autres joueurs
  * Affichage d'un lien pour se connecter a la partie (domain.com/connect/?g=gameID ou pour plus d'info sur `gameID` voir chapitre ***!!!***)
  
* **in-game**

  * **Possibilité de se connecter en tant que :**

    * MJ (Maitre du Jeu)

      * Connection grâce a un mot de passe défini lors de la création de la partie
      * Autorité sur les autres joueurs et sur la partie
        * Gestions des Joueurs
        * **Créer un Joueur**
            * Choix de `plID` (voir chap ***!!!***) 
          * Choix de tous ses attributs (voir chap ***!!!***)
          * Supprimer un joueur
          * Suppression de toutes les information le concernant (voir plus bas pour la sauvegarde des informations)
          * Sauvegarde des information d'un joueur au format `JSON`
        * Possibilité de restaurer un joueur selon un fichier de sauvegarde au format `JSON`
        * **Gestion de la partie**
          * Ouvrir ou fermer l'accès a la partie aux PJ
            * L'ouverture et fermeture se fait automatiquement a l'accès du MJ
            * Lorsque la fermeture est déclaré, un message est envoyé aux joueurs restants pour les informer
          * Changer les information et paramètres de la partie
            * Changer nom de la partie
            * Changer mot de passe MJ
            * Changer mot de passe PJ
            * Changer le model d'attributs
            * Changer thème
          * Supprimer la partie





### 3.2 Architecture de Geny

Geny se base sur une architecture simple qui permet une grande modularité et extensibilité

Cette architecture que j'ai nommé "Command Based System", a défaut d'un nom universel, et voici une page Wikipédia dédié : https://en.wikipedia.org/wiki/Command_pattern

Concrètement et simplement, chaque action (ouvrir un popup, jouer un son..) est déclenché par une commande, composé d'un "opcode" (opération code) et de possibles arguments selon l'opération

L'intérêt de cette architecture, est que une commande est facilement manipulable, car elle est sous forme de texte, donc peut être mise dans un fichier de configuration, ou être transféré sur internet, ce qui dans le cas d'une application web "multijoueur" est très pratique

Voici quelques exemples de commandes :

```json
{
    "opcode": "openWin",
    "arg": {
        "win": "about"
    }
}
```

Ouvre une fenêtre "about"

```json
{
	"opcode": "playSound", 
    "arg": {
        "type": "ambiance", 
        "url": "exemple.com/sounds/tavern2.mp3"
    }
}
```

Joue un son d'ambiance (voir chap ***!!!*** sur les sons)

Imaginons un instant que nous ayons besoin d'afficher les paramètres pour changer quelque chose

```
                                                    
 ╭───╮     ┌────────────┐       ┌─────────────────┐ 
 │ P │ ──► │ keypress() │ ◄───► │ keymap settings │ 
 ╰───╯     └────────────┘       └─────────────────┘ 
              │     ┌───────────┐     ┌───────────┐ 
              └───► │ execute() │ ──► │ openWin() │ 
                    └───────────┘     └───────────┘ 
                                                    
```



On le voit, ces commandes sont formaté en JSON, ce qui permet de les interpréter facilement, dans de nombreux langages, y compris par l'API

Tout a l'heure, je parlais de multijoueur, et effectivement Geny est en multijoueur en temps réel, ainsi, si un joueur lance un dé, une animation du dé et le résultat doit être affiché au même moment sur les différents clients web, alors la commande doit être 

