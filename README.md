# pjs3D_experiments
Objectif : tester la portabilité de code Processing vers ProcessingJS et P5js

Dans le dépôt ci-dessous, j'avais présenté différents scénarions de migration de sketch Processing vers P5js :
https://github.com/gregja/p5Migration

Je ne m'étais intéressé à l'époque qu'à P5js (et pas à ProcessingJS) et surtout je m'étais focalisé sur le portage de sketchs 2D, laissant complètement de côté le problème de la 3D. Je me suis efforcé de combler ces lacunes au travers du présent dépôt.

Donc même si j'ai converti quelques sketchs 2D, histoire de comparer ProcessingJS et P5js dans ce domaine, je me suis surtout focalisé sur la conversion de sketchs Processing utilisant un rendu 3D (P3D ou OPENGL) vers WebGL.

Même si j'ai rencontré quelques difficultés ponctuelles - plutôt du côté de P5 que de ProcessingJS - les résultats obtenus sont très encourageants, et devraient faire plaisir à tous ceux qui ont développé des projets 3D avec Processing, et se demandent comment les porter sur le web (c'est notamment le cas de certains membres du meetup CreativeCodeParis). 

Pour effectuer ces tests, j'ai choisi arbitrairement d'utiliser ProcessingJS comme une "pure JS library", comme expliqué à la fin du "Pomax Guide" (cf. lien ci-dessous). Cette technique nous amène à un code plus verbeux, car il faut préfixer (avec le code de son choix) toutes les fonctions et constantes de ProcessingJS, mais cela permet d'obtenir un meilleur contrôle sur le déroulement du sketch, et ainsi de l'intégrer au sein d'applications plus complexes.
Mais vous pouvez utiliser ProcessingJS de plusieurs façons, comme expliqué dans le "Pomax Guide", à vous de
trouver le mode qui vous convient le mieux.

Pour les adaptations de certains sketchs sur P5, j'ai opté pour le même style d'écriture, et ce pour les mêmes raisons.

Vous trouverez dans ce même dépôt deux templates, que vous pourrez réutiliser si vous le souhaitez :
- template_sketch_pjs.MD : squelette de sketch pour ProcessingJS
- template_sketch_p5.MD : squelette de sketch pour P5

Pour faire fonctionner ce projet, téléchargez le localement et ouvrez la page index.html (qui se trouve dans le répertoire "project") avec votre navigateur. Cette page est le point d'entrée vers les différents exemples.

Pour certains des tests relatifs à la 3D, j'ai repris et adapté des sketchs Processing tirés de livres dont les références sont indiquées au cas par cas. Les sketchs pour lesquels je n'ai pas indiqué de référence sont pour la
plupart empruntés aux sites officiels (de Processing, ProcessingJS ou P5js). Pour tous les autres, je me suis efforcé d'indiquer mes sources au cas par cas. J'espère n'avoir oublié personne.

Il faut souligner que ces tests ont été effectués entre janvier et février 2019, avec les versions 0.7.2 de P5 et 1.4.8 de ProcessingJS. Ce dernier propose un support très complet de la 3D proposée par Processing, mais P5 ne s'en sort pas trop mal non plus, et il sera intéressant de surveiller l'évolution de ces deux frameworks.

IMPORTANT : j'ai patché le code source de la version de ProcessingJS utilisée dans ce projet, de manière à utiliser l'API WEBGL2 en priorité sur WEBGL (si disponible dans le navigateur), avec antialiasing actif par défaut. Le patch se trouve dans le fichier processing-patch.js (cf. fonction "getGLContext"). Cela explique pourquoi vous obtiendrez généralement un meilleur rendu avec ProcessingJS, qui se paiera parfois par une moindre fluidité. Je n'ai pas tenté d'appliquer ce même patch dans P5, mais je pense que c'est techniquement possible.

-----------
Liens utiles :

- Pomax Guide (ProcessingJS)
http://processingjs.org/articles/PomaxGuide.html

- Introduction à la 3D avec Processing
https://processing.org/tutorials/p3d/

- Introduction à l'utilisation de WebGL dans P5</a><br>
https://github.com/processing/p5.js/wiki/Getting-started-with-WebGL-in-p5

- WEBGL mode architecture (P5)
https://github.com/processing/p5.js/blob/master/developer_docs/webgl_mode_architecture.md

----------

Ce projet est dédié à mes amis du meetup CreativeCodeParis, et à tous les amoureux de creative coding.
https://www.meetup.com/fr-FR/CreativeCodeParis/
