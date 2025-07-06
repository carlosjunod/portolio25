import React, { useState, useRef } from 'react';
import emailjs from 'emailjs-com';
import ReCAPTCHA from 'react-google-recaptcha';
import styles from './Contact.module.css';

const ErrorMessage = ({ message }) => (
  <div className={styles.errorMessageText}>
    <span>🚨</span> {message}
  </div>
);

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    recruiter: false,
  });
  const [errors, setErrors] = useState({});
  const [formStatus, setFormStatus] = useState('');
  const recaptchaRef = useRef();

  const validate = () => {
    const newErrors = {};
    if (!formData.name) {
      newErrors.name = 'Name is required.';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid.';
    }
    if (!formData.recruiter) {
      newErrors.recruiter = 'This field is required.';
    }
    if (!recaptchaRef.current.getValue()) {
      newErrors.recaptcha = 'Please complete the reCAPTCHA.';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    // Clear error when user interacts with the field
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const onRecaptchaChange = () => {
    // Clear recaptcha error when user completes it
    if (errors.recaptcha) {
      setErrors({ ...errors, recaptcha: null });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const serviceID = 'service_48reqmo';
    const templateID = 'template_bk4mtem';
    const userID = 'pNLsV9xokOwQniCEO';

    emailjs.sendForm(serviceID, templateID, e.target, userID)
      .then((result) => {
        console.log(result.text);
        setFormStatus('success');
        setFormData({ name: '', email: '', message: '', recruiter: false });
        recaptchaRef.current.reset();
        e.target.reset(); // Reset file input
        setTimeout(() => setFormStatus(''), 5000);
      }, (error) => {
        console.log(error.text);
        setFormStatus('error');
        setTimeout(() => setFormStatus(''), 5000);
      });
  };

  return (
    <div className={styles.contactSection}>
      <div className={styles.container}>
        <div className={styles.leftColumn}>
          <h2>Contact Me</h2>
          <div className={styles.contactInfo}>
            <p>Phone: +1 (321) 352 0116</p>
            <p>Email: hello@carlosjunod.me</p>
          </div>
          <a href="/resume.pdf" download className={styles.resumeButton}>
            Download Resume
          </a>
        </div>
        <div className={styles.rightColumn}>
          <form className={styles.contactForm} onSubmit={handleSubmit} noValidate>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? styles.inputError : ''}
              />
              {errors.name && <ErrorMessage message={errors.name} />}
            </div>
            <div className={styles.inputGroup}>
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? styles.inputError : ''}
              />
              {errors.email && <ErrorMessage message={errors.email} />}
            </div>
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
            ></textarea>
            <div className={styles.inputGroup}>
              <div className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  id="recruiter"
                  name="recruiter"
                  checked={formData.recruiter}
                  onChange={handleChange}
                  className={errors.recruiter ? styles.inputError : ''}
                />
                <label htmlFor="recruiter">Are you a recruiter?</label>
              </div>
              {errors.recruiter && <ErrorMessage message={errors.recruiter} />}
            </div>
            <input type="file" name="attachment" className={styles.fileInput} />
            <div className={styles.inputGroup}>
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey="6LeWinkrAAAAAMSUTHTkBQYpp9q0QLraXTG6r8bN"
                onChange={onRecaptchaChange}
                theme="dark"
              />
              {errors.recaptcha && <ErrorMessage message={errors.recaptcha} />}
            </div>
            <button type="submit">Send Message</button>
          </form>
          {formStatus === 'success' && (
            <div className={styles.successMessage}>
              <span>🚀</span> Message sent successfully!
            </div>
          )}
          {formStatus === 'error' && (
            <div className={styles.errorMessage}>
              Failed to send message. Please try again later.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

