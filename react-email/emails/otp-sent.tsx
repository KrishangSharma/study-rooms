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

interface OTPVerificationEmailProps {
  otp: string;
}

export const OTPSent = ({ otp = '123456' }: OTPVerificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Verify your Study Rooms account - Your verification code is {otp}</Preview>
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
          <Heading style={h2}>Welcome to Study Rooms! 🎓</Heading>

          <Text style={text}>Hey there!</Text>

          <Text style={text}>
            Thank you for creating your Study Rooms account! I'm excited to help you find the
            perfect study spaces and connect with fellow students.
          </Text>

          <Text style={text}>
            To complete your registration and verify your email address, please use the verification
            code below:
          </Text>

          <Section style={otpContainer}>
            <Text style={otpLabel}>Your Verification Code</Text>
            <Text style={otpCode}>{otp}</Text>
          </Section>

          <Text style={text}>
            This code will expire in <strong>3 minutes</strong> for security purposes.
          </Text>

          <Text style={text}>Once verified, you'll be able to:</Text>

          <Section style={featureList}>
            <Text style={featureItem}>📚 Create your own study rooms</Text>
            <Text style={featureItem}>👥 Connect with existing study groups</Text>
            <Text style={featureItem}>⏰ Manage your study sessions with Pomodoro tehcniques</Text>
            <Text style={featureItem}>📊 And much more!</Text>
          </Section>

          <Text style={text}>
            If you didn't create this account, you can safely ignore this email.
          </Text>
        </Section>

        <Section style={footer}>
          <Text style={footerText}>
            Need help? Contact me at <a href="mailto:krishang.sharma.17704@gmail.com">My Email</a>
          </Text>
          <Text style={footerText}>Study Rooms - Making studying better, together.</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default OTPSent;

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
