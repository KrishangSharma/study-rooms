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
  Button,
} from '@react-email/components';

interface PasswordResetEmailProps {
  name: string;
  email: string;
  token: string;
}

export const PasswordResetEmail = ({
  name = 'John Doe',
  email = 'john@example.com',
  token = 'abc123def456ghi789',
}: PasswordResetEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your Study Rooms password - Secure link inside</Preview>
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

            <Text style={text}>Hi {name},</Text>

            <Text style={text}>
              We received a request to reset the password for your Study Rooms account associated
              with <strong>{email}</strong>.
            </Text>

            <Text style={text}>
              If you made this request, click the button below to reset your password. This link is
              secure and will take you to a page where you can create a new password.
            </Text>

            <Section style={buttonContainer}>
              <Button href={token} style={resetButton}>
                Reset My Password
              </Button>
            </Section>

            <Text style={text}>
              This reset link will expire in <strong>15 minutes</strong> for security purposes.
            </Text>

            <Text style={text}>
              If the button doesn't work, you can copy and paste this link into your browser:
            </Text>

            <Section style={linkContainer}>
              <Text style={linkText}>{token}</Text>
            </Section>

            <Section style={securityInfo}>
              <Text style={securityTitle}>🛡️ Security Information</Text>
              <Text style={securityItem}>• This link can only be used once</Text>
              <Text style={securityItem}>• It expires in 15 minutes</Text>
              <Text style={securityItem}>• Only works for the email address: {email}</Text>
            </Section>

            <Text style={text}>
              <strong>Didn't request this password reset?</strong> You can safely ignore this email.
              Your password will remain unchanged, and no further action is required.
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
};

export default PasswordResetEmail;

// Styles
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

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const resetButton = {
  backgroundColor: '#1a1a1a',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 32px',
  border: 'none',
  cursor: 'pointer',
};

const linkContainer = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '16px',
  margin: '16px 0',
  wordBreak: 'break-all' as const,
};

const linkText = {
  color: '#6b7280',
  fontSize: '14px',
  fontFamily: 'Monaco, Consolas, "Courier New", monospace',
  margin: '0',
  lineHeight: '1.4',
};

const securityInfo = {
  backgroundColor: '#fef3f2',
  border: '1px solid #fecaca',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const securityTitle = {
  color: '#dc2626',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 12px',
};

const securityItem = {
  color: '#7f1d1d',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '4px 0',
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
