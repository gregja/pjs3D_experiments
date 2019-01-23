# pjs3D_experiments
Objectif : tester la portabilité de code Processing vers ProcessingJS (en particulier la 3D et le support de WebGL)

Le but de ce projet personnel et assez expérimental est de tester la bonne portabilité du code Processing vers ProcessingJS.
Priorité a été donnée au test de sketchs utilisant un rendu 3D vers WebGL. Les résultats obtenus sont très encourageants, et devraient faire plaisir à tous ceux qui ont développé des projets 3D avec Processing, et se demandent comment porter ces projets sur le web (sachant que le projet concurrent de ProcessingJS, n'atteint pas un aussi bon niveau de portabilité pour la 3D, à mon grand regret d'ailleurs).

Pour effectuer ces tests, j'ai choisi arbitrairement d'utiliser ProcessingJS comme une "pure JS library", comme expliqué à la fin du "Pomax Guide". Ce choix a été dicté par le fait que je suis un développeur Javascript, et non Java, et que je souhaite utiliser ProcessingJS de cette manière. Mais vous pouvez utiliser ProcessingJS de plusieurs façons, comme expliqué dans le "Pomax Guide", à vous de trouver le mode qui vous convient le mieux.

Pour les tests relatifs à la 3D, j'ai repris et adapté plusieurs sketchs tirés d'un très bon livre de Jan Vantomme sur Processing2 (cf. référence en bas de page). J'ai ajouté à certains de ces sketchs quelques fonctionnalités telles que zoom, et changement de rendu additionnel.

ATTENTION : pour faire fonctionner le projet, téléchargez le localement et ouvrez la page index.html (qui se trouve dans le répertoire "project") avec votre navigateur. Cette page est le point d'entrée vers les différents exemples.

Lien vers le "Pomax Guide" :
http://processingjs.org/articles/PomaxGuide.html
