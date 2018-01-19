const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const { dbUri } = require('../config/environment');

mongoose.connect(dbUri, { useMongoClient: true });

const Track = require('../models/track');
const User = require('../models/user');

User
  .create([{
    firstName: 'Cliff',
    lastName: 'Richard',
    username: 'Cliff',
    photo: 'http://www.pressgazette.co.uk/wp-content/uploads/2016/06/Cliff-Richard-SHUTTERSTOCK-e1466078975114.jpg',
    email: 'will@will4.com',
    password: 'password',
    passwordConfirmation: 'password'
  },{

    firstName: 'Disco',
    lastName: 'Stu',
    username: 'Disco Stu',
    photo: 'https://memegenerator.net/img/images/600x600/7446564/disco-stu-says.jpg',
    email: 'will@will3.com',
    password: 'password',
    passwordConfirmation: 'password'
  }])
  .then((users) => {
    console.log(`${users.length} users created`);
    return Track
      .create([{
        name: 'Only You',
        artist: 'Steve Monite',
        image: 'https://f4.bcbits.com/img/a0186196842_10.jpg',
        link: 'https://www.youtube.com/watch?v=L-2CyO8pc0E',
        createdBy: users[1].id
      }]);
  })
  .then((tracks) => console.log(`${tracks.length} tracks created`))
  .catch((err) => console.log(err))
  .finally(() => mongoose.connection.close());
