define('UserModelSpec', ['UserModel'], function(User) {

  describe('User Model', function() {
    var fakeUser;

    before(function() {
      fakeUser = {
        name    : "Alex",
        email   : "example@example.com",
        <TODO add other fields> : "foobar",
        born    : new Date()
      };
    });

    it("should check for required fields", function() {
      var user = new User({ name: 'Alex' });

      user.isValid().should.be.false;

      user.set({
        name    : 'Alex',
        email   : fakeUser.email,
        <TODO add other fields> : fakeUser.<TODO add other fields>,
        born    : new Date()
      });

      user.isValid().should.be.true;
    });

    // 2 <= name.length <= 100
    it("should check for valid name", function() {
      var user, badName, i;

      user = new User({
        name    : 'A',
        email   : fakeUser.email,
        <TODO add other fields> : fakeUser.<TODO add other fields>,
        born    : fakeUser.born,
      });
      user.isValid().should.be.false;

      for (i = 1; i < 102; i++) {
        badName += 'A';
      }

      user.set('name', badName);
      user.isValid().should.be.false;

      user.set('name', fakeUser.name);
      user.isValid().should.be.true;

    });

    it("should check for valid email", function() {
      var user = new User({
        name    : fakeUser.name,
        <TODO add other fields> : fakeUser.<TODO add other fields>,
        born    : fakeUser.born,
        email   : "example@example"
      });

      user.isValid().should.be.false;

      user.set('email', "example@example.com");

      user.isValid().should.be.true;
    });

    // 7 <= <TODO add other fields>.length <= 100
    it("should check for valid <TODO add other fields>", function() {
      var user, badName, i;

      user = new User({
        name    : fakeUser.name,
        email   : fakeUser.email,
        <TODO add other fields> : "foobar",
        born    : fakeUser.born,
      });
      user.isValid().should.be.false;

      for (i = 1; i < 102; i++) {
        badName += 'A';
      }

      user.set('<TODO add other fields>', badName);
      user.isValid().should.be.false;

      user.set('<TODO add other fields>', fakeUser.<TODO add other fields>);
      user.isValid().should.be.true;

    });

  });

});
