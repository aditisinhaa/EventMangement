setTimeout(function(){
$("#Login").html("Logout");
$("#Login").parent().attr("action","/logout?action=signout");
$("#SignUp").html("My Connections");
$("#SignUp").parent().attr("action","/saved-connections");
$(".user").html("Welcome Aditi!");
},100);
