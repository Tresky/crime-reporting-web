/**
 * This is a manifest file that will be compiled into application.js, which will
 * include all the files listed below.
 *
 * Any JavaScript file within this directory can be referenced here using a
 * relative path.
 *
 * It's not advisable to add code directly here, but if you do, it will appear
 * at the bottom of the compiled file.
 *
 * If you are planning to include all custom JavaScript inside main.js then
 * you don't have touch this file at all, otherwise add additional scripts
 * below via "//= require [filename]".
 */

/* LIST OF 3rd PARTY LIBS */
//= require lib/angular.min
//= require lib/angular-route.min
//= require lib/angular-animate.min
//= require lib/jquery-2.1.3.min
//= require lib/bootstrap.min
//= require lib/ui-bootstrap.min
//= require lib/ui-bootstrap-tpls.min
//= require lib/zxcvbn
//= require lib/v-modal.min


/* LIST OF CUSTOM JS CODE FILES */
//= require common/app
//= require services/locationService
//= require services/libraryStore
//= require services/notificationService
//= require http-services/Crime
//= require http-services/Comment
//= require http-services/Notification
//= require common/homeController
//= require common/reportCrimeController
//= require common/crimeListController
//= require common/pswStrengthComponent
//= require common/userController

//= require directives/beaware
//= require directives/crimeListItem
//= require directives/commentContainer
//= require directives/comment
//= require directives/commentCreate
