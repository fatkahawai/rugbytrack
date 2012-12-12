/*
 * unit tests for the User object
 * 
 */
define('UserModelSpec', ['UserModel'], function(User) {

  describe('User Model', function() {
    var validUserData;
    
    before(function() {
      validUserData = { // NB: this is just individual fields it is NOT a User object !
        userName : 'BillyValidname',
        password: 'fubar123',
        fullName: 'Billy Validname',
        email   : 'example@example.com',
        born    : new Date(),
        dateRegistered : new Date(),
        twitterID : 'johnny'
      }; 
    });

    it('should check for required fields', function() {
      var user = new User({
        userName    : 'JohnnyNoemail'
      });
      // NB! you can't just access model attributes like user.userName, you need to use .get()
      console.log('TEST : testing user '+user.get("userName")); 

      user.isValid().should.be.false;

      user = new User({
        userName    : validUserData.userName,
        email : validUserData.email
      });
      user.isValid().should.be.true;
    });

    // 2 <= userName.length <= 100
    it('should check for valid userName', function() {
      var user, 
          badName = 'NAME TOO LONG ', 
          i;

      user = new User({
        userName    : 'A',
        email   : validUserData.email,
        born    : validUserData.born,
      });
      user.isValid().should.be.false;

      for (i = 1; i < 102; i++) {
        badName += 'B';
      }

      user.set('userName', badName);
      user.isValid().should.be.false;

      user.set('userName', validUserData.userName);
      user.isValid().should.be.true;

    });

    it('should check for valid email', function() {
      var user = new User({
        userName    : validUserData.userName,
        born    : validUserData.born,
        email   : 'example@example'
      });

      user.isValid().should.be.false;

      user.set('email', 'example@example.com');

      user.isValid().should.be.true;
    });


  });

});
