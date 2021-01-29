function incr() {
    var nombre = document.getElementById("nombre");
    var annees = document.getElementById("annees");
    var secondes = document.getElementById("secondes");
    var heures = document.getElementById("heures");
    var minutes = document.getElementById("minutes");
    var jours = document.getElementById("jours");
    var joursPres = document.getElementById("joursPres");
  
    var date = new Date();
    nombre.innerHTML = date.getTime() - 1560002400000;
    
    joursPres.innerHTML = parseInt((date.getTime() - 1560002400000)/86400000);
    
    annees.innerHTML = parseInt( (date.getTime() - 1560002400000)/ 31536000000);
    jours.innerHTML = parseInt((date.getTime() - 1560002400000)/86400000);
    secondes.innerHTML = parseInt((date.getTime() - 1560002400000)/1000);
    heures.innerHTML = parseInt((date.getTime() - 1560002400000)/3600000);
    minutes.innerHTML = parseInt((date.getTime() - 1560002400000)/60000);
}



console.log("salut");
window.setInterval(incr, 1);
