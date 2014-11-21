//Victoria Wellington
//INFO343, Autumn 2014
//To practice implementing javascript and ajax

"use strict";


var commentUrl = 'https://api.parse.com/1/classes/comment';



angular.module('commentsApp', ['ui.bootstrap'])
	.config(function($httpProvider){

		$httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'b32FNRLsuft4FK6b1HS4Gwnh6VRsOUiRHUb1HTmo';
		$httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'w1rVFm6gMlDPc0oIORwoamiiI51zysQ0xgUt2p7G';

	}) 
 
 
 
    .controller('commentController', function($scope, $http) {



        $scope.refresh = function() {
	        $scope.loading = true;
			$http.get('https://api.parse.com/1/classes/comment/')
                .success(function(responseData) {
                    $scope.comment = responseData.results;

                   $scope.comment.sort(function(obj1, obj2){
                   		return obj2.score - obj1.score;

                   });

                   console.log($scope.comment);



                   

                    
                })
                .error(function(err) {
                    console.log(err);
                })
                .finally(function(){
                    $scope.loading=false;
                });
        };

        $scope.refresh();

         $scope.newComment = { score: 0};

         $scope.addComment = function(comment) {
            // Post will add a new item to the class
            $http.post('https://api.parse.com/1/classes/comment', comment) 
                .success(function(responseData) {
                    comment.objectId = responseData.objectId;
                    $scope.newComment = {score: 0};  //initalize score at 0
                    $scope.comment.push(comment);

                })
         };     

         
        $scope.increaseRank = function(comment, change) {
            
        		if (change > 0 || comment.ranking > 0) {
            	$scope.updating = true;
				$http.put(commentUrl + '/' + comment.objectId, {
					score: {
						__op: 'Increment',
						amount: change
					}
				})


                .success(function(responseData) {
					comment.score = responseData.score;
					
                })
                .error(function(err) {
                    console.log(err);
                })
                .finally(function() {
                    $scope.updating = false;
                });
             }
            $scope.refresh();

        };

        $scope.delete = function(comment) {
			$scope.inserting = true;
			$http.delete(commentUrl + '/' + comment.objectId, comment)
				.success(function() {
					$scope.refresh();
				})
				.error(function(err) {
					console.log(err);
				})
				.finally(function() {
					$scope.inserting = false;
				});
		};


 }); 


 
