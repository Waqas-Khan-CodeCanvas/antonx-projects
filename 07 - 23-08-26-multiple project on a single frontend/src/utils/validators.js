export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function validateContactForm({ name, email, message }) {
  const errors = {}
  if (!name.trim()) errors.name = 'Enter your name.'
  if (!email.trim()) errors.email = 'Enter your email.'
  else if (!isValidEmail(email)) errors.email = 'Enter a valid email address.'
  if (!message.trim()) errors.message = 'Enter a message.'
  else if (message.trim().length < 10) errors.message = 'Message should be at least 10 characters.'
  return errors
}