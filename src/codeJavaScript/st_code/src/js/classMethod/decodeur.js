
class Decodeur {
    //ATTRIBUTS et CONSTRUCTEUR
    constructor(matriceImage) {
        this.matriceImage = matriceImage;
        this.dictableEncodageGrayCode = {
            'a': '000000',
            'b': '000001',
            'c': '000011',
            'd': '000010',
            'e': '000110',
            'f': '000111',
            'g': '000101',
            'h': '000100',
            'i': '001100',
            'j': '001101',
            'k': '001111',
            'l': '001110',
            'm': '001010',
            'n': '001011',
            'o': '001001',
            'p': '001000',
            'q': '011000',
            'r': '011001',
            's': '011011',
            't': '011010',
            'u': '011110',
            'v': '011111',
            'w': '011101',
            'x': '011100',
            'y': '010100',
            'z': '010101',
            'A': '010111',
            'B': '010110',
            'C': '010010',
            'D': '010011',
            'E': '010001',
            'F': '010000',
            'G': '110000',
            'H': '110001',
            'I': '110011',
            'J': '110010',
            'K': '110110',
            'L': '110111',
            'M': '110101',
            'N': '110100',
            'O': '111100',
            'P': '111101',
            'Q': '111111',
            'R': '111110',
            'S': '111010',
            'T': '111011',
            'U': '111001',
            'V': '111000',
            'W': '101000',
            'X': '101001',
            'Y': '101011',
            'Z': '101010',
            0: '101110',
            1: '101111',
            2: '101101',
            3: '101100',
            4: '100100',
            5: '100101',
            6: '100111',
            7: '100110',
            8: '100010',
            9: '100011'
          };
        this.correspGrayCodeBarre =[[0.125, [0, 0, 0]],
        [0.250, [0, 0, 1]],
        [0.375, [0, 1, 1]],
        [0.500, [1, 1, 1]],
        [0.625, [1, 1, 0]],
        [0.750, [1, 0, 0]],
        [0.875, [1, 0, 1]],
        [1, [0, 1, 0]]]
        // ENCAPSULATION
    };
    // METHODES SPECIFIQUES
    recuperationContourObjets() {
        // Methode: matriceImage >> recuperationContourObjets >> matriceContoursObjet
        // INITIALISATION
        let matriceImage = cv.imread(this.matriceImage);
        var matriceCountoursObjets = new Array();
        var matriceImageNiveauDeGris = matriceImage.clone()
        // matriceImage >> conversion image en niveaux de gris >> matriceImageNiveauDeGris
        cv.cvtColor(matriceImage, matriceImageNiveauDeGris, cv.COLOR_RGBA2GRAY, 0);
        //afficher image:
        //
        cv.imshow(output1, matriceImageNiveauDeGris);
        //
        //matriceImageNiveauDeGris >>detection des bords des objets >> matriceImageAvecContours
        var matriceImageAvecContours = matriceImageNiveauDeGris.clone()
        cv.Canny(matriceImageNiveauDeGris, matriceImageAvecContours, 50, 200, 3, false);
        //afficher image:
        //
        cv.imshow(output2, matriceImageAvecContours);
        //
        // creation des matrices et liste de vecteurs  contours et hierarchy
        let contours = new cv.MatVector();
        let hierarchy = new cv.Mat();
        // matriceImageAvecContours >> r??cup??ration des contours de chaques objets >> matriceContoursObjets
        cv.findContours(matriceImageAvecContours, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_NONE);
        //mise sous forme de matrice de dimension 3
        var matriceContoursObjets = new Array();
        // parcours complet de la liste d'objets
        for (var i = 0; i < contours.size(); ++i) {
            matriceContoursObjets[i] = new Array();
            var ci = contours.get(i);  //R??cup??ration de l'objet courant dans une variable
            // parcours des points du contours de l'objet
            for (var j = 0; j < ci.data32S.length; j += 2) {
                var coordonneeX = ci.data32S[j]; //R??cup??ration de la coordonn??e x
                var coordonneeY = ci.data32S[j + 1]; //R??cup??ration de la coordonn??e y
                // Insertion du point sous forme de liste contenant x et y
                matriceContoursObjets[i].push([coordonneeX, coordonneeY]);
            }
        }
        console.log("DEBUT : R??cup??re dans l'image une matrice de contours d'objet");
        return matriceContoursObjets;
    };

    //M??thode : matriceContoursObjets >> R??cup??ration du ratio en fonction de la hauteur des barres obtenues sur la photo >> listeRatios
    recuperationRatio(matriceContourObjet) {
        function recupererListeObjets(matrice){
            //matriceContoursObjet >> RECUPERATION DES HAUTEURS ET POSITIONS DES OBJETS >> listeObjet
            // listeObjets >> Initialisation >> listeObjets
            var liste = [];
            //listeObjets >> Parcours complet de la matrice des contours objets avec traitement syst??matique >> listeObjets
            for (var objetCourant = 0; objetCourant < matrice.length; objetCourant++)
            {
                //ymin, ymax, xpos >> Intialisation des variables avec le premier point de contours de lo'objet >> ymin, ymax, ypos
                var ymin = matrice[objetCourant][0][1];
                var ymax = matrice[objetCourant][0][1];
                var xmin = matrice[objetCourant][0][0];
                var xmax = matrice[objetCourant][0][0];
                for (var point = 0; point < matrice[objetCourant].length; point++) {
                    if (matrice[objetCourant][point][1] > ymax) {
                        ymax = matrice[objetCourant][point][1];
                    }
                    if (matrice[objetCourant][point][1] < ymin) {
                        ymin = matrice[objetCourant][point][1];
                    }
                    if (matrice[objetCourant][point][0] > xmax) {
                        xmax = matrice[objetCourant][point][0];
                    }
                    if (matrice[objetCourant][point][0] < xmin) {
                        xmin = matrice[objetCourant][point][0];
                    }
                }
                // calcule de la hauteur de la barre
                var hauteur = ymax - ymin;
                var largeur = xmax - xmin;
                // ajout de la hauteur et de posx dans la listeObjets
                liste.push([xmin, xmax, ymin, ymax, hauteur, largeur]);
            }
            return liste;
        }

        //Fonction qui trouve les objets r??f??rences dans l'image
        // listeObjets >> trouverReferences >> listeReferences
        function trouverReferences(listeObjets) {
            var listeReferences = [];
            var marge = 2; // marge d'erreur pour trouver des objets circulaires
            var XmaxLogo = -1;
            for (var i = 0; i < listeObjets.length; i++)  //parcours de tout les objets de l'image
            {   
                var hauteurTemp = listeObjets[i][4]; // hauteur de l'objet courant 
                if (hauteurTemp - marge <= listeObjets[i][5] && listeObjets[i][5] <= hauteurTemp + marge && listeObjets[i][0]>XmaxLogo && hauteurTemp != 0) 
                // si l'objet courant est un cercle ( sa hauteur correspond a peu pres a sa longueur) et qu'il plac?? apres le logo 
                {
                    listeReferences.push(listeObjets[i]); // on le met dans la liste des references ( petit cercle au debut et la fin du code)
                    if(hauteurTemp >= 20)     // si c'est un cercle assez grand il est consid??r?? comme le logo
                    {
                        XmaxLogo = listeObjets[i][1]   // on precise le Xmax du logo
                    }
                }
           }
        return listeReferences
        }


        //creation de la fonction pour le tri
        function fonctionTri(a, b) {
            if (a[0] === b[0]) {
                return 0;
            }
            else {
                if (a[0] > b[0]) {
                    return 1;
                }
                else {
                    return -1;
                }
            }
        }
       
        //fonction pour calculer une distance euclidienne dans un repere cartesien (ici l'image)
        function distance(a, b) {
            return Math.sqrt((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2)
        }
        // fonction de conversion de radian ?? degr??
        // a >> toDegree >> a
        function toDegree(a)
        {
            return a * 180/Math.PI;
        }
        // fonction de conversion de degr?? ?? radian
        // a >> toRadian >> a
        function toRadian(a)
        {
            return a/(180/Math.PI);
        }

        // fonction qui calcule l'angle entre l'axe des abscisse et la ligne form??e par les 2 boules de references du st_code
        // boule1,boule2 >> calculerAnglet >> angle
        function calculerAngle(boule1, boule2) {

            // initialisation des points
            var pointA = [boule1[0] + boule1[4] / 2, boule1[2] + boule1[5] / 2];
            var pointB = [boule2[0] + boule2[4] / 2, boule2[2] + boule2[5] / 2];
            // definition d'un point virtuel qui formera avec le point A une droite parallele ?? l'axe des absciess
            var pointVirtuel = [pointB[0], pointA[1]];
            //afficher les droites sur l'image
            contx.strokeStyle = '#f00';
            contx.beginPath();
            contx.moveTo(pointA[0], pointA[1]);
            contx.lineTo(pointB[0], pointB[1]);
            contx.stroke();
            contx.strokeStyle = '#f00';
            contx.beginPath();
            contx.moveTo(pointA[0], pointA[1]);
            contx.lineTo(pointVirtuel[0], pointVirtuel[1]);
            contx.stroke();
            //
            console.log("Coordonn??es boule r??f??rence 1 ", pointA);
            console.log("Coordonn??es boule r??f??rence 2 ", pointB);
            console.log("Coordonn??es boule virtuelle ", pointVirtuel);

            // calcul des distance
            // calcul de la valeur de l'hypothenuse avec les points A et B
            var hypothenuse = distance(pointA, pointB); 
            // calcul de la valeur du cot?? adjacent avec le point A et le point Virtuel
            var adjacent = distance(pointA, pointVirtuel);
            console.log("Hypotenuse:", hypothenuse, "Adjacent:", adjacent);
            // utilisation du calcul trigonometriques pour obtenir l'angle
            var angle = Math.acos(adjacent / hypothenuse);
            angle = toDegree(angle);
            // selon la position du point virutel, on defini l'angle comme positif ou negatif
            
            if(pointVirtuel[1]<pointB[1]) // si le point virtuel est au dessus du point B, alors l'angle est positif
            {
                console.log("L'angle est positif");
                return angle;
            }
            else                           // si le point virtuel est en dessous du point B, alors l'angle est negatif
            {
                console.log("L'angle est negatif");
                return -angle;
            }
            
        }
        //fonction qui donne les coordon??es d'un point apres une rotation d'un certain angle dans un repere cartesien
        // x,y,angle >> rotationPoint >> [x,y]
        function rotationPoint(x,y,angle)
        {
            var angleRadian = toRadian(angle)
            return [x*Math.cos(angleRadian)+y*-1*Math.sin(angleRadian) ,x*Math.sin(angleRadian)+y*Math.cos(angleRadian)]
        }
        //fonction qui renvoie un matrice de point apres une rotation d'un certain angle par rapport a un certain point qui est le centre autour duquel s'effectue la rotation
        // centre,matrice,angle >> rotationEnsemble >> matriceApresRotation
        function rotationEnsemble(centre,matrice,angle)
        {   
            var matriceApresRotation = [];
           for(var objet=0; objet < matrice.length; objet++)
           {
            matriceApresRotation.push([])
            for(var point=0; point < matrice[objet].length;point++)
            {   
                // le y du point dans un repere cartesien de centre "centre"
                var XRepereCentre = matrice[objet][point][0] - centre[0];
                var YRepereCentre = matrice[objet][point][1] - centre[1];
                // rotation des coordon??es du point
                var nouveauPoint = rotationPoint(XRepereCentre,YRepereCentre,angle);
                // remettre les points dans le plan d'origine
                var XRepereOrigine = nouveauPoint[0] + centre[0];
                var YRepereOrigine = nouveauPoint[1] + centre[1];
                // remplacer le point par le nouveau point apres rotation
                matriceApresRotation[objet].push([XRepereOrigine,YRepereOrigine])
            }
           }
           return matriceApresRotation
        }
        // listeObjetTrie >> CALCUL DES RATIOS >> listeRatios
        // hauteurReference >> Affectation de  la hauteur du premier objet a la hauteur reference >> hauteurReference
        function calculerLesRatios(listeObjets)
        {
            var hauteurReference = logo[4];
            var listeRatios = [];
            // hauteurReference, listeObjetsTrie >> Parcours et calcul de chaques ratios >> listeRatios
            for (var objetCourant = 0; objetCourant < listeObjets.length; objetCourant++)
            {
                {
                // listeRatios, hauteurReference, listeObjetTrie >> Division de la hauteur de l'objet courant par la hauteur r??f??rence et insertion dans la liste des ratios >> listeRatios
                var ratio = (listeObjets[objetCourant][4] / hauteurReference);
                listeRatios.push(ratio);
                }

            }
            return listeRatios;
        }
        //fonction qui filtre les objets en fonction de leurs position et gardent seulement ceux dont la position est bien entre la boule1 et la boule2 (les reperes)
        // liste >> filtreObjet >> listeObjetFiltreApresRotation
        function filtreObjet(liste)
        {
            var listeObjetFiltreApresRotation = [];
            var limiteXmax = boule2[1];
            var limiteXmin = boule1[0];
            for (var i = 0; i < liste.length; i++)
            {
                var objetCourant = liste[i];
                if(objetCourant[0]>=limiteXmin && objetCourant[1]<=limiteXmax)
                {
                    listeObjetFiltreApresRotation.push(objetCourant)
                }
            }
        return listeObjetFiltreApresRotation;
        }

        // on utilise toutes les fonctions d??clar??es precedement

        //on recupere la liste des objets de la matriceContourObjet
        var listeObjets = recupererListeObjets(matriceContourObjet);
        console.log("R??cup??re liste objet");
        // on tri les objets dans l'ordre croissant des position en X
        var listeObjetsTrie = listeObjets.sort(fonctionTri);
        console.log("Trie la liste Objet");
        // on recupere les objets qui sont les references du code
        var listeReferences = trouverReferences(listeObjetsTrie);
        console.log("Trouve les r??f??rences dans cette liste");
        var logo = listeReferences[0];
        var boule1 = listeReferences[1];
        var boule2 = listeReferences[2];
        var centreLogo = [logo[0]+(logo[1]-logo[2])/2,logo[2]+(logo[3]-logo[2])/2];
        var angleRotation = calculerAngle(boule1,boule2);
        var matriceObjetsApresRotation = rotationEnsemble(centreLogo,matriceContourObjet,angleRotation);
        console.log("Rotation de la matrice");
        //console.log("matrice Avant Filtrage",matriceObjetsApresRotation);

        var listeObjetsApresRotation = recupererListeObjets(matriceObjetsApresRotation);
        //console.log("liste Objet Avant Filtrage",listeObjetsApresRotation);

        var listeObjetsFiltreApresRotation = filtreObjet(listeObjetsApresRotation,logo,boule1,boule2);
        //console.log("liste Objet Apres Filtrage",listeObjetsFiltreApresRotation);
        console.log("Filtrage du bruit dans l'image");
        var listeObjetsFiltreEtTrieApresRotation = listeObjetsFiltreApresRotation.sort(fonctionTri);
        //console.log("liste Objet Apres trie",listeObjetsFiltreEtTrieApresRotation);

        var listeRatios = calculerLesRatios(listeObjetsFiltreEtTrieApresRotation);

        console.log("Calcul Liste Ratios :",listeRatios)
        return listeRatios;
    };
    conversionGrayCode(listeRatios) {
        function valeurAbsolue(a) {
            if (a < 0) { return -a }
            else { return a };
        }
        //licenceGrayCode >> INITIALISATION VARIABLE >> licenceGrayCode
        var licenceGrayCode = "";
        
        //listeRatios, licenceGrayCode >> Parcours complet de listeRatios avec traitement syst??matique >> licenceGrayCode
        for (var i = 0; i < listeRatios.length; i++) {

            //listeRatios, licenceGrayCode >> Recherche de la valeur la plus proche du ratio >> licenceGrayCode
            // min, inidicePlusProche >> Initialisation variable >> min, indicePlusProche
            var min = 1;
            var indicePlusProche;
            //licenceGrayCode, listeRatios, min, indicePlusProche >> Recherche de la premi??re occurence du ratio dans la variable global TABLE_DECODAGE >> licenceGrayCode
            for (var ligne = 0; ligne < this.correspGrayCodeBarre.length; ligne++) {
                //Si la diff??rence entre la valeur courante de liste ratio et la valeur reference de la table d'encodage est inf??rieur ?? min
                if (valeurAbsolue(listeRatios[i] - this.correspGrayCodeBarre[ligne][0]) < min) {
                    //min, indicePlusProche >> Affectation de l'indice de la TABLE_DECODAGE le plus proche de la valeur courante de listeRatios >> min, indicePlusProche
                    min = valeurAbsolue(listeRatios[i] - this.correspGrayCodeBarre[ligne][0])
                    indicePlusProche = ligne;
                }
            }
            //licenceGrayCode, indicePlusProche >>Parcours et ajout de la correspondance en gray code dans licenceGrayCode >> licenceGrayCode
            for (var bit = 0; bit < 3; bit++) {
                licenceGrayCode += this.correspGrayCodeBarre[indicePlusProche][1][bit];
            }
        }
        console.log("Convertion en grayCode",licenceGrayCode)
        return licenceGrayCode;
    };
    conversionLicence(licenceGreyCode) {
        // licenceGrayCode >> conversion licenceGrayCode en chaine de caracteres >> numLicence
        // initialisation des variables >> numLicence, motBinaire
        var numLicence = "";
        var motBinaire = "";
        // licenceGrayCode, motBinaire >> Parcours complet de licenceGrayCode avec traitement systematique
        // licenceGrayCode, motBinaire >> recuperation de 6 bits de la liste dans un motBinaire temporaire >> motBinaire
        for (var bit = 0; bit < licenceGreyCode.length - 1; bit += 6) {
            //motBinaire >> remise de mot binaire en liste vide >> motBinaire
            motBinaire = "";
            if (licenceGreyCode.length - bit < 6) {
                break;
            }
            for (var decalage = 0; decalage < 6; decalage++) {
                motBinaire += licenceGreyCode[bit + decalage];
            }

            // motBinaire, licenceGrayCode, numLicence >> recherche de premiere occurence dans la variable globale TABLE_ENCODAGE_GRAY_CODE >> numLicence
            for (var cle in this.dictableEncodageGrayCode ) {
                if (JSON.stringify(motBinaire) == JSON.stringify(this.dictableEncodageGrayCode[cle])) {
                    // numLicence >> Ajout du caractere correspondait dans numLicence >> numLicence
                    numLicence += cle;
                }
            }
        }
        console.log("Le num??ro de licence est :",numLicence);
        return numLicence;
    }
  async testerLicense(numLicence)
  {
    // Envoyez la requ??te AJAX
      const xhr = new XMLHttpRequest();
      xhr.open("GET" , 'http://localhost:8888/SportTrack/src/codeJavaScript/st_code/src/php/api.php?license='+numLicence);
      xhr.send();
      // Attendre la r??ponse avant de continuer
      const response = await new Promise((resolve,reject) => {
        xhr.onreadystatechange = function () {
          if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            // Parse la r??ponse en tant que JSON
            const response = JSON.parse(this.responseText);
            // V??rifie si la licence existe
            if (response.licenseExists == true) {
              // La licence existe
              resolve(true);
            } else {
              // La licence n'existe pas
              resolve(false);
            }
          }
        };
      });
      return response
  }

};