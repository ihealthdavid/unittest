if (Meteor.isClient) {
  // counter starts at 0
  var bpDisplayScale;

  Template.unittest.rendered = function() {
    Session.set('testType', 'search');
  }

  Template.unittest.helpers({
    testType: function() {
      return Session.get('testType');
    },
    statusMsg: function() {
      return Session.get('status-msg');
    }
  });

  Template.search.helpers({
    hasDeviceInfo: function() {
      return (Session.get('device-info') !== undefined);
    },
    name: function() {
      return Session.get('device-info')["name"];
    },
    address: function() {
      return Session.get('device-info')["address"];
    }
  });


  Template.measure.rendered = function() {
    var bpContainer = $.find("#bp-container");
    var w = $(bpContainer).width()

    $(bpContainer).height(w);

    bpDisplayScale = w / 16.737;
  };

  Template.measure.helpers({
    hasReadings: function() {
      return (Session.get('measurements') !== undefined);
    },
    getCircleAttrs: function(bp) {
      var d = Math.round(Math.sqrt(bp / Math.PI) * 2 * bpDisplayScale);

      return "width: " + d + "px; height: " + d + "px;";
    },
    bpNumDisplay: function() {
      var readings = Session.get('measurements');
      
      if (readings) {
        if (readings.pressure) {
          return readings.pressure;
        } else {
          Session.set('status-msg', 'Done!');
          return readings.highpressure + "/" + readings.lowpressure;
        }
      } else {
        return "";
      }
    },
    bpMeasure: function() {
      var bp = Session.get('measurements').pressure;

      return (bp ? bp : "");
    },
    bpSystolic: function() {
      var bp = Session.get('measurements').highpressure;
      
      return (bp ? bp : "");
    },
    bpDiastolic: function() {
      var bp = Session.get('measurements').lowpressure;
      
      return (bp ? bp : "");
    },
    heartRate: function() {
      var hr = Session.get('measurements').heartrate;

      return (hr ? hr : "");
    },
    arrythmia: function() {
      var a = Session.get('measurements').arrythmia;
      
      return (a ? a : "");
    },
    labelForKey: function(key) {
      switch(key) {
        case "highpressure":
          return "Systolic";
        case "lowpressure":
          return "Diastolic";
        case "heartrate":
          return "Heart Rate";
        default:
          return key.charAt(0).toUpperCase() + key.slice(1);
      }
    },
    readingForKey: function(key) {
      return Session.get('measurements')[key];
    }
  });

  Template.unittest.events({

    'click .nav-btn' : function () {
      var btn = $.find(".nav-btn:visible")[0];
      Session.set('testType', $(btn).data("navkey"));
      $('.nav-btn').toggleClass('hidden');
    },
    
    'click .search' : function () {
      console.log('search...');
      var success = function(message){
        console.log(message);

        Session.set('testType', 'search');
        Session.set('measurements', undefined);

        var parsedMsg = JSON.parse(message);
        var info = { "address": parsedMsg["address"],
                     "name": parsedMsg["name"] };

        Session.set('device-info', info);
        Session.set('status-msg', parsedMsg["msg"]);
      }

      var failure = function(message){
        console.log(message);
        Session.set('status-msg', message);
      }
      Session.set('status-msg', "searching..."); 
      BpManagerCordova.search("", success, failure, "test");
    },
    
    'click .startmeasure' : function () {
      console.log('start!');
      var success = function(message){
        console.log(message);

        Session.set('testType', 'measure');
        Session.set('status-msg', 'Reading...');

        var info, measurements, status;

        try {
          var parsedMsg = JSON.parse(message);
          
          if (parsedMsg["address"]) {
            info = { "address": parsedMsg["address"] };
            delete parsedMsg["address"];
          }
          if (parsedMsg["wave"]) {
            delete parsedMsg["wave"];
          }
          measurements = parsedMsg;
        } catch (e) {
          status = message;
        }
        Session.set('device-info', info);
        Session.set('status-msg', status);
        Session.set('measurements', measurements);
      }

      var failure = function(message){
        console.log(message);

        Session.set('status-msg', message);
      }
      BpManagerCordova.startMeasure("8CDE52143F1E", success, failure, "test");
    },
    
    'click .stopmeasure' : function () {
      console.log('stopmeasure!');
      var success = function(message){
        console.log(message);

        Session.set('testType', 'measure');
        Session.set('status-msg', message);
      }

      var failure = function(message){
        console.log(message);

        Session.set('status-msg', message);
      }
      BpManagerCordova.stopMeasure("8CDE52143F1E", success, failure);

    },

    'click .stopsearch' : function () {
      console.log('stopsearch!');

      var success = function(message){
        console.log(message);

        Session.set('testType', 'search');
        Session.set('status-msg', message);
      }

      var failure = function(message){
        console.log(message);
        Session.set('status-msg', message);
      }
      BpManagerCordova.stopMeasure("8CDE52143F1E", success, failure);

    },

    'click .enableOffline' : function () {
      console.log('enableOffline!');
      var success = function(message){
        console.log(message);
        Session.set('status-msg', message);
      }

      var failure = function(message){
        console.log(message);
        Session.set('status-msg', message);
      }
      BpManagerCordova.enableOffline("8CDE52143F1E", success, failure);

    },

    'click .disenableOffline' : function () {
      console.log('disenableOffline!');
      var success = function(message){
        console.log(message);
        Session.set('status-msg', message);
      }

      var failure = function(message){
        console.log(message);
        Session.set('status-msg', message);
      }
      BpManagerCordova.disenableOffline("8CDE52143F1E", success, failure);

    },

    'click .getOfflineNum' : function () {
      console.log('getOfflineNum!');
      var success = function(message){
        console.log(message);
        Session.set('status-msg', message);
      }

      var failure = function(message){
        console.log(message);
        Session.set('status-msg', message);
      }
      BpManagerCordova.getOfflineNum("8CDE52143F1E", success, failure, "test");

    },

    'click .getOfflineData' : function () {
      console.log('getOfflineData!');
      var success = function(message){
        console.log(message);
        Session.set('status-msg', message);
      }

      var failure = function(message){
        console.log(message);
        Session.set('status-msg', message);
      } 
      BpManagerCordova.getOfflineData("8CDE52143F1E", success, failure, "test");

    },

    'click .getBattery' : function () {
      console.log('getBattery!');
      var success = function(message){
        console.log(message);
        Session.set('status-msg', message);
      }

      var failure = function(message){
        console.log(message);
        Session.set('status-msg', message);
      }
      BpManagerCordova.getBattery("8CDE52143F1E", success, failure);

    },

    'click .isEnableOffline' : function () {
      console.log('isEnableOffline!');
      var success = function(message){
        console.log(message);
        Session.set('status-msg', message);
      }

      var failure = function(message){
        console.log(message);
        Session.set('status-msg', message);
      }
      BpManagerCordova.isEnableOffline("8CDE52143F1E", success, failure);

    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    console.log('Server is start to run!');
  });
}
