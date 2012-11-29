/*
 * unit tests for the User object
 * 
 */
define('UserModelSpec', ['UserModel'], function(User) {

  describe('User Model', function() {
    var fakeUser;

    before(function() {
      fakeUser = {
        userName    : "Alex",
        password: "fubar",
        fullName: "Alex Leslie",
        email   : "example@example.com",
        //  TODO:  add other fields> : "foobar", 
        born    : new Date()
      };
    });

    it("should check for required fields", function() {
      var user = new User({ userName: 'Alex' });

      user.isValid().should.be.false;

      user.set({
        userName    : 'Alex',
        email   : fakeUser.email,
        //  TODO:  add other fields> : fakeUser.//  TODO:  add other fields>,
        born    : new Date()
      });

      user.isValid().should.be.true;
    });

    // 2 <= userName.length <= 100
    it("should check for valid userName", function() {
      var user, badName, i;

      user = new User({
        userName    : 'A',
        email   : fakeUser.email,
        //  TODO:  add other fields> : fakeUser.//  TODO:  add other fields>,
        born    : fakeUser.born,
      });
      user.isValid().should.be.false;

      for (i = 1; i < 102; i++) {
        badName += 'A';
      }

      user.set('userName', badName);
      user.isValid().should.be.false;

      user.set('userName', fakeUser.userName);
      user.isValid().should.be.true;

    });

    it("should check for valid email", function() {
      var user = new User({
        userName    : fakeUser.userName,
        //  TODO:  add other fields> : fakeUser.//  TODO:  add other fields>,
        born    : fakeUser.born,
        email   : "example@example"
      });

      user.isValid().should.be.false;

      user.set('email', "example@example.com");

      user.isValid().should.be.true;
    });

    // 7 <= //  TODO:  add other fields>.length <= 100
    it("should check for valid //  TODO:  add other fields>", function() {
      var user, badName, i;

      user = new User({
        userName    : fakeUser.userName,
        email   : fakeUser.email,
        //  TODO:  add other fields> : "foobar",
        born    : fakeUser.born,
      });
      user.isValid().should.be.false;

      for (i = 1; i < 102; i++) {
        badName += 'A';
      }

      user.set('//  TODO:  add other fields>', badName);
      user.isValid().should.be.false;

      user.set('//  TODO:  add other fields>', fakeUser.//  TODO:  add other fields>);
      user.isValid().should.be.true;

    });

  });

});
