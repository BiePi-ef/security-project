import bcrypt from 'bcrypt';

export default function crypt(value) {
  const saltRounds = 10;
  bcrypt.genSalt(saltRounds, (err, salt) => { 
    if (err) {
        throw err;
    }
    bcrypt.hash(value, salt, (err, hash) => {
      if (err) {
          throw err;
      }
      return hash;
    });
  });
}
