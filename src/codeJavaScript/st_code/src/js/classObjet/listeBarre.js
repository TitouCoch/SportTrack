//Classe ListeBarre 
/**
 * Classe représentant une liste de barres.
 *
 * Une liste de barres est une liste de hauteurs de barre.
 *
 * @author Sport Track
 */
class ListeBarre {
    //Constructeur de l'objet Licence
    /**
     * Constructeur de l'objet ListeBarre.
     *
     * @param {string} l - Liste de barres. Valeur par défaut : chaine vide.
     */
    constructor(l="") {
      this.listeBarre = l;
    }

    //Encapsulation
    //Fonction qui retourne l'attribut numLicence
    /**
     * Retourne la liste de barres.
     *
     * @return {string} Liste de barres.
     */
    getListeBarre(){
        return this.listeBarre;
    }

    /**
     * Modifie la liste de barres.
     *
     * @param {string} l - Nouvelle liste de barres. Valeur par défaut : chaine vide.
     */
    setListeBarre(l=""){
        this.listeBarre=l;
    }

  }