import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../hooks/useContent';
import { useLang } from '../context/LanguageContext';
import { Check } from 'lucide-react';

const goalOptions = [
  { key: 'form_goal_1', he: 'שיקום וחוסן קהילתי', en: 'Rehabilitation & Resilience' },
  { key: 'form_goal_2', he: 'שירותים לגיל השלישי', en: 'Senior Citizens' },
  { key: 'form_goal_3', he: 'חינוך סביבתי וקיימות', en: 'Environmental Education & Sustainability' },
  { key: 'form_goal_4', he: 'שיקום פוסט-טראומה (PTSD)', en: 'Post-Trauma Rehabilitation (PTSD)' },
  { key: 'form_goal_5', he: 'אחר', en: 'Other' },
];

export default function ContactForm() {
  const { t } = useContent('contact');
  const { lang } = useLang();
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: '', role: '', institution: '', phone: '', email: '', message: '',
    goals: [],
  });

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const toggleGoal = (goal) => {
    setForm(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal],
    }));
    if (errors.goals) setErrors(prev => ({ ...prev, goals: null }));
  };

  const validate = () => {
    const errs = {};
    const req = lang === 'he' ? 'שדה חובה' : 'Required field';
    if (!form.name.trim()) errs.name = req;
    if (!form.role.trim()) errs.role = req;
    if (!form.institution.trim()) errs.institution = req;
    if (!form.phone.trim()) errs.phone = req;
    if (!form.email.trim()) errs.email = req;
    if (form.goals.length === 0) errs.goals = req;
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    /* INTEGRATION: connect to Netlify Forms, EmailJS, or Vercel serverless */
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{
        background: 'white', borderRadius: '12px', padding: '3rem',
        boxShadow: '0 8px 40px rgba(30,51,40,0.08)',
        textAlign: 'center',
      }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          background: 'var(--color-sage)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem',
        }}>
          <Check size={32} color="white" />
        </div>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: '1.5rem', marginBottom: '0.75rem' }}>
          {t('form_success_title', lang === 'he' ? 'קיבלנו את פנייתכם!' : 'We received your message!')}
        </h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          {t('form_success_text', lang === 'he' ? 'ניצור איתכם קשר בתוך 24 שעות.' : "We'll be in touch within 24 hours.")}
        </p>
        <Link to="/" className="btn-primary">
          {t('form_success_back', lang === 'he' ? 'חזרה לדף הבית' : 'Back to Homepage')}
        </Link>
      </div>
    );
  }

  const inputStyle = (field) => ({
    width: '100%', padding: '0.75rem 1rem',
    border: `1.5px solid ${errors[field] ? '#E74C3C' : 'var(--green-pale)'}`,
    borderRadius: '8px', fontFamily: "'Jost', sans-serif", fontSize: '1rem',
    transition: 'border-color 0.2s',
    outline: 'none', background: 'white',
  });

  return (
    <form onSubmit={handleSubmit} style={{
      background: 'white', borderRadius: '12px', padding: '2.5rem',
      boxShadow: '0 8px 40px rgba(30,51,40,0.08)',
    }}>
      {/* Name */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>
          {t('form_name', lang === 'he' ? 'שם מלא' : 'Full Name')} *
        </label>
        <input
          type="text"
          value={form.name}
          onChange={e => handleChange('name', e.target.value)}
          placeholder={lang === 'he' ? 'ישראל ישראלי' : 'John Doe'}
          style={inputStyle('name')}
        />
        {errors.name && <span style={{ color: '#E74C3C', fontSize: '0.8rem' }}>{errors.name}</span>}
      </div>

      {/* Role */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>
          {t('form_role', lang === 'he' ? 'תפקיד בארגון / יישוב' : 'Role in Organization / Municipality')} *
        </label>
        <input
          type="text"
          value={form.role}
          onChange={e => handleChange('role', e.target.value)}
          placeholder={t('form_role_placeholder', lang === 'he' ? 'מנהל קהילה / יו״ר ועד / מנהל רווחה...' : 'Community Manager, Committee Chair, Welfare Director...')}
          style={inputStyle('role')}
        />
        {errors.role && <span style={{ color: '#E74C3C', fontSize: '0.8rem' }}>{errors.role}</span>}
      </div>

      {/* Institution */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>
          {t('form_institution', lang === 'he' ? 'שם היישוב / המוסד' : 'Name of Community / Institution')} *
        </label>
        <input
          type="text"
          value={form.institution}
          onChange={e => handleChange('institution', e.target.value)}
          placeholder={lang === 'he' ? 'שם הקיבוץ, עיר, עמותה...' : 'Kibbutz, city, NGO...'}
          style={inputStyle('institution')}
        />
        {errors.institution && <span style={{ color: '#E74C3C', fontSize: '0.8rem' }}>{errors.institution}</span>}
      </div>

      {/* Goals */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.75rem' }}>
          {t('form_goal', lang === 'he' ? 'מה המטרה המרכזית שלכם?' : 'Primary Goal')} *
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {goalOptions.map(opt => {
            const checked = form.goals.includes(opt.key);
            return (
              <label key={opt.key} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <div
                  className={`custom-checkbox ${checked ? 'checked' : ''}`}
                  onClick={() => toggleGoal(opt.key)}
                >
                  {checked && <Check size={14} color="white" />}
                </div>
                <span style={{ fontSize: '0.95rem' }}>
                  {t(opt.key, lang === 'he' ? opt.he : opt.en)}
                </span>
              </label>
            );
          })}
        </div>
        {errors.goals && <span style={{ color: '#E74C3C', fontSize: '0.8rem' }}>{errors.goals}</span>}
      </div>

      {/* Phone */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>
          {t('form_phone', lang === 'he' ? 'טלפון' : 'Phone')} *
        </label>
        <input
          type="tel"
          dir="ltr"
          value={form.phone}
          onChange={e => handleChange('phone', e.target.value)}
          style={inputStyle('phone')}
        />
        {errors.phone && <span style={{ color: '#E74C3C', fontSize: '0.8rem' }}>{errors.phone}</span>}
      </div>

      {/* Email */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>
          {t('form_email', lang === 'he' ? 'דוא״ל' : 'Email')} *
        </label>
        <input
          type="email"
          dir="ltr"
          value={form.email}
          onChange={e => handleChange('email', e.target.value)}
          style={inputStyle('email')}
        />
        {errors.email && <span style={{ color: '#E74C3C', fontSize: '0.8rem' }}>{errors.email}</span>}
      </div>

      {/* Message */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>
          {t('form_message', lang === 'he' ? 'ספרו לנו על הקהילה שלכם (אופציונלי)' : 'Tell us about your community (optional)')}
        </label>
        <textarea
          rows={4}
          value={form.message}
          onChange={e => handleChange('message', e.target.value)}
          placeholder={t('form_message_placeholder', lang === 'he' ? 'כמה תושבים? יש לכם שטח פנוי? מה האתגר הכי גדול שלכם עכשיו?' : "How many residents? Do you have available land? What's your biggest challenge right now?")}
          style={{ ...inputStyle('message'), resize: 'vertical' }}
        />
      </div>

      <button type="submit" className="btn-primary" style={{ width: '100%' }}>
        {t('form_submit', lang === 'he' ? 'שלחו לנו הודעה →' : 'Send Us a Message →')}
      </button>
    </form>
  );
}
