import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
  Row,
  Column,
} from '@react-email/components';

interface PasswordResetEmailProps {
  username: string;
  otp: string;
}

export const PasswordReset = ({ username = 'User', otp = '123456' }: PasswordResetEmailProps) => (
  <Html>
    <Head />
    <Preview>Reset your Study Rooms password - Your reset code is {otp}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Row>
            <Column>
              <Heading style={h1}>Study Rooms</Heading>
              <Text style={subtitle}>by Krishang Sharma</Text>
            </Column>
          </Row>
        </Section>

        <Section style={content}>
          <Heading style={h2}>Password Reset Request 🔐</Heading>

          <Text style={text}>Hello {username}!</Text>

          <Text style={text}>
            We received a request to reset your Study Rooms account password. If you made this
            request, please use the verification code below to proceed with resetting your password.
          </Text>

          <Text style={text}>
            To reset your password, please use the following one-time password (OTP):
          </Text>

          <Section style={otpContainer}>
            <Text style={otpLabel}>Your Password Reset Code</Text>
            <Text style={otpCode}>{otp}</Text>
          </Section>

          <Text style={text}>
            This code will expire in <strong>10 minutes</strong> for security purposes.
          </Text>

          <Text style={text}>
            <strong>Important security reminders:</strong>
          </Text>

          <Section style={featureList}>
            <Text style={featureItem}>🔒 Never share this code with anyone</Text>
            <Text style={featureItem}>⏰ Use this code within 10 minutes</Text>
            <Text style={featureItem}>🛡️ Choose a strong, unique password</Text>
            <Text style={featureItem}>📧 We'll never ask for your password via email</Text>
          </Section>

          <Text style={text}>
            If you didn't request a password reset, please ignore this email. Your account remains
            secure and no changes will be made.
          </Text>

          <Text style={text}>
            If you're having trouble or didn't request this reset, please contact our support team
            immediately.
          </Text>
        </Section>

        <Section style={footer}>
          <Text style={footerText}>
            Need help?{' '}
            <b>
              <a href="mailto:krishang.sharma.17704@gmail.com">Contact Me.</a>
            </b>
          </Text>
          <Text style={footerText}>Study Rooms - Making studying better, together.</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default PasswordReset;

// Styles (identical to the original template)
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const header = {
  padding: '32px 24px 24px',
  borderBottom: '1px solid #e6ebf1',
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '32px',
  fontWeight: '700',
  margin: '0 0 8px',
  lineHeight: '1.2',
};

const subtitle = {
  color: '#6b7280',
  fontSize: '16px',
  margin: '0',
  fontWeight: '500',
};

const content = {
  padding: '32px 24px',
};

const h2 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: '600',
  margin: '0 0 24px',
  lineHeight: '1.3',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '16px 0',
};

const otpContainer = {
  backgroundColor: '#f8fafc',
  border: '2px solid #e2e8f0',
  borderRadius: '12px',
  padding: '32px',
  textAlign: 'center' as const,
  margin: '32px 0',
};

const otpLabel = {
  color: '#6b7280',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0 0 12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

const otpCode = {
  color: '#1a1a1a',
  fontSize: '36px',
  fontWeight: '700',
  letterSpacing: '8px',
  margin: '0',
  fontFamily: 'Monaco, Consolas, "Courier New", monospace',
};

const featureList = {
  margin: '24px 0',
};

const featureItem = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '8px 0',
  paddingLeft: '8px',
};

const footer = {
  borderTop: '1px solid #e6ebf1',
  padding: '24px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '8px 0',
};
