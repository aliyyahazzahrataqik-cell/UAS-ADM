const bcrypt = require('bcryptjs');

const hash = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
const pass = 'password';

bcrypt.compare(pass, hash).then(res => {
  console.log('Match?', res);
});
