/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
		var networkState = navigator.network.connection.type;  
		if (networkState == Connection.UNKNOWN || networkState == Connection.NONE){
			navigator.notification.alert("Necesitas estar conectado a Internet para usar todas las funcionalidades de esta APP.", function() {	});
		} 
		destinationType = navigator.camera.DestinationType;
		sourceType = navigator.camera.PictureSourceType;
        app.receivedEvent('deviceready');
		
		document.addEventListener("pause", this.onPause, false);
		
    },
	onPause: function (){
		window.localStorage["useridg"] = undefined;
		window.localStorage["sociog"] = undefined;
		window.localStorage["socionum"] = undefined;
	},
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
		var pushNotification = window.plugins.pushNotification;
		pushNotification.register(app.successHandler, app.errorHandler,{"senderID":"349344466742","ecb":"app.onNotificationGCM"});
		
    },
	errorHandler:function(error) {
		//alert(error);
	},
	successHandler: function(result) {
		//alert('Callback Success! Result = '+result)
	},
	onNotificationGCM: function(e) {
        switch( e.event )
        {
            case 'registered':
                if ( e.regid.length > 0 )
			{
				/* var uid = window.localStorage["userid"];
				$.post("http://www.clubmascodin.com/app/savegcm.php", {userid:uid,gcmkey:e.regid}, function(res) {
					if (res==true){

					}
				},"json"); */
			}
            break;
 
            case 'message':
              // this is the actual push notification. its format depends on the data model from the push server
              console.log('message = '+e.message);
			  window.localStorage["messages"] += '<div class="ui-corner-all custom-corners">'
												+ '  <div class="ui-body ui-body-a">'
												+ '    <p>'+e.message+'</p>'
												+ '  </div>'
												+ '</div>';
				window.location = "mensajes.html";								
            break;
 
            case 'error':
              console.log('GCM error = '+e.msg);
            break;
 
            default:
              console.log('An unknown GCM event has occurred');
              break;
        }
    },
	capturePhoto: function() {
		navigator.camera.getPicture(app.onPhotoDataSuccess, app.onFail, { quality: 50,
		destinationType: destinationType.DATA_URL });
	},

	getPhoto: function() {
		// Retrieve image file location from specified source
		navigator.camera.getPicture(app.onPhotoFileSuccess, app.onFail, { quality: 50,
		destinationType: destinationType.FILE_URI,
		sourceType: sourceType.PHOTOLIBRARY});
	},
	disableBG: function() {
		// Retrieve image file location from specified source
		window.localStorage['bgpictureData'] = '';
		window.localStorage['bgpictureFile'] = '';
		//$('body').css('background-image','none').css('background-size','inherit').css('background-position','inherit');
		//navigator.notification.alert("Fondo guardado", function() {	});
		window.location = "configuracion.html";				
	},
	onFail: function(fail)
	{
		console.log(fail);
	},
	onPhotoDataSuccess: function(imageData) {
		/* $('body').css('background-image','url(data:image/jpeg;base64,' + imageData + ')').css('background-size','cover').css('background-position','center center');
		$('.ui-page, .ui-content').css('background', 'transparent');
		$('.ui-panel-wrapper').css('background', 'rgba(255,255,255,0.5)'); */
		var uid = window.localStorage["userid"];
		$.post("http://www.clubmascodin.com/app/savebg.php", {userid:uid,bg:imageData}, function(res) {
			if (res==true){
				//navigator.notification.alert("Fondo guardado", function() {});
				window.localStorage['bgpictureData'] = imageData;
				window.localStorage['bgpictureFile'] = '';
				window.location = "configuracion.html";
			}
		},"json");
		
	},
	onPhotoFileSuccess: function(imageData) { 
		/* $('body').css('background-image','url(' + imageData + ')').css('background-size','cover').css('background-position','center center');
		$('.ui-page, .ui-content').css('background', 'transparent');
		$('.ui-panel-wrapper').css('background', 'rgba(255,255,255,0.5)'); */
		var uid = window.localStorage["userid"];
		$.post("http://www.clubmascodin.com/app/savebg.php", {userid:uid,bg:imageData}, function(res) {
			if (res==true){
				//navigator.notification.alert("Fondo guardado", function() {});
				window.localStorage['bgpictureData'] = '';
				window.localStorage['bgpictureFile'] = imageData;
				window.location = "configuracion.html";
			}
		},"json");

	}
	
};

