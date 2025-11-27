import bcrypt from 'bcrypt';

export default function cryptPassword(password) {
  const saltRounds = 10;
  bcrypt.genSalt(saltRounds, (err, salt) => { 
    if (err) {
        throw err;
    }
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) {
          throw err;
      }
      return hash;
    });
  });
}
