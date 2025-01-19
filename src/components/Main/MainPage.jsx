import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Workflow, Database, Layers, Heart, Shield, Compass, Brain } from 'lucide-react';
import styles from './MainPage.module.css';

const MainPage = () => {
  const navigate = useNavigate();
  const [animationStage, setAnimationStage] = useState(0);
  const [secondSectionVisible, setSecondSectionVisible] = useState(false);
  const [thirdSectionVisible, setThirdSectionVisible] = useState(false);
  const [fourthSectionVisible, setFourthSectionVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const sequence = [
      { stage: 1, delay: 800 },
      { stage: 2, delay: 1600 },
      { stage: 3, delay: 2400 },
      { stage: 4, delay: 3200 },
    ];

    sequence.forEach(({ stage, delay }) => {
      setTimeout(() => setAnimationStage(stage), delay);
    });

    // Add intersection observer for sections
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.target.id === 'secondSection' && entry.isIntersecting) {
            setSecondSectionVisible(true);
          }
          if (entry.target.id === 'thirdSection' && entry.isIntersecting) {
            setThirdSectionVisible(true);
          }
          if (entry.target.id === 'fourthSection' && entry.isIntersecting) {
            setFourthSectionVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    const secondSection = document.getElementById('secondSection');
    const thirdSection = document.getElementById('thirdSection');
    const fourthSection = document.getElementById('fourthSection');
    
    if (secondSection) observer.observe(secondSection);
    if (thirdSection) observer.observe(thirdSection);
    if (fourthSection) observer.observe(fourthSection);

    return () => observer.disconnect();
  }, []);

  // Auto-rotate active feature in fourth section
  useEffect(() => {
    if (fourthSectionVisible) {
      const interval = setInterval(() => {
        setActiveFeature((prev) => (prev + 1) % 8); // Updated to account for all 8 features
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [fourthSectionVisible]);

  return (
    <div className={styles.pageWrapper}>
      {/* First Section */}
      <div className={styles.mainContainer}>
        {/* Navigation */}
        <nav className={styles.navBar}>
          <h1 className={styles.logo}>MoyoAI</h1>
          <button className={styles.contactBtn} onClick={() => navigate('/contact')}>
            Contact us
          </button>
        </nav>

        {/* Main Content */}
        <main className={styles.content}>
          <div className={styles.leftSection}>
            <h2 className={`${styles.mainTitle} ${animationStage >= 1 ? styles.animateIn : ''}`}>
              Welcome to ChatWithMoyo
            </h2>
            
            <p className={`${styles.subtitle} ${animationStage >= 2 ? styles.animateIn : ''}`}>
              Your trusted companion for emotional support, personal growth, and meaningful connections.
            </p>

            <button 
              className={`${styles.ctaButton} ${animationStage >= 4 ? styles.animateIn : ''}`}
              onClick={() => navigate('/login')}
            >
              Login to Get Started
            </button>
          </div>

          <div className={`${styles.rightSection} ${animationStage >= 3 ? styles.animateIn : ''}`}>
            <div className={styles.imageContainer}>
              <img 
                src="/assets/page1.png" 
                alt="MoyoAI Illustration" 
                className={styles.mainImage}
              />
            </div>
          </div>
        </main>

        {/* Background Elements */}
        <div className={styles.backgroundElements}>
          <div className={`${styles.blurCircle} ${styles.blur1}`}></div>
          <div className={`${styles.blurCircle} ${styles.blur2}`}></div>
        </div>
      </div>

      {/* Second Section */}
      <div id="secondSection" className={styles.secondContainer}>
        <main className={styles.content}>
          <div className={`${styles.leftSection} ${secondSectionVisible ? styles.visible : ''}`}>
            <div className={styles.imageContainer}>
              <img
                src="/assets/page2.png"
                alt="MoyoAI Conversation"
                className={`${styles.mainImage} ${styles.secondImage}`}
              />
            </div>
          </div>

          <div className={`${styles.rightSection} ${secondSectionVisible ? styles.visible : ''}`}>
            <h2 className={`${styles.mainTitle} ${styles.secondTitle}`}>
              Discover the Power of Moyo
            </h2>
            
            <p className={`${styles.subtitle} ${styles.secondSubtitle}`}>
              ChatWithMoyo is more than an app—it's a safe space where you can process emotions, reflect, and grow. Whether you're seeking a listening ear, tools to manage stress, or pathways to build confidence, Moyo is here to support you every step of the way.
            </p>

            <button
              className={`${styles.ctaButton} ${styles.secondButton}`}
              onClick={() => navigate('/demo')}
            >
              Try Demo
            </button>
          </div>
        </main>

        <div className={styles.backgroundElements}>
          <div className={`${styles.blurCircle} ${styles.blur3}`}></div>
          <div className={`${styles.blurCircle} ${styles.blur4}`}></div>
        </div>
      </div>

      {/* Third Section */}
      <div id="thirdSection" className={`${styles.thirdContainer} ${thirdSectionVisible ? styles.visible : ''}`}>
        <div className={styles.featuresGrid}>
          {/* Feature 1 */}
          <div className={styles.featureCard}>
            <div className={styles.featureIconWrapper}>
              <div className={styles.supportAnimation}>
                <div className={styles.animatedCircles}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className={styles.iconInner}></div>
              </div>
            </div>
            <h3>Personalized Emotional Support</h3>
            <p>Struggling to express yourself? Moyo is your digital confidant. Engage in personalized conversations tailored to your emotions and unique situations. Benefit from a private, secure experience powered by advanced AI designed to understand you.</p>
          </div>

          {/* Feature 2 */}
          <div className={styles.featureCard}>
            <div className={styles.featureIconWrapper}>
              <div className={styles.workflowAnimation}>
                <div className={styles.gear1}></div>
                <div className={styles.gear2}></div>
                <div className={styles.gear3}></div>
              </div>
            </div>
            <h3>Complete Privacy and Security</h3>
            <p>Your data, your rules. All information stays on your device—secure and inaccessible to anyone else. With offline functionality, you can rely on Moyo even without an internet connection.</p>
          </div>

          {/* Feature 3 */}
          <div className={styles.featureCard}>
            <div className={styles.featureIconWrapper}>
              <div className={styles.dataVisualization}>
                <div className={styles.bar1}></div>
                <div className={styles.bar2}></div>
                <div className={styles.bar3}></div>
                <div className={styles.bar4}></div>
              </div>
            </div>
            <h3>Guided Self-Reflection</h3>
            <p>Take charge of your mental well-being. Explore mood trackers, journaling prompts, and self-care tips designed to help you process emotions effectively. Receive actionable insights and structured guidance to help you grow at your own pace.</p>
          </div>

          {/* Feature 4 */}
          <div className={styles.featureCard}>
            <div className={styles.featureIconWrapper}>
              <div className={styles.uxAnimation}>
                <div className={styles.circle}></div>
                <div className={styles.square}></div>
                <div className={styles.triangle}></div>
              </div>
            </div>
            <h3>Pathways to Professional Help</h3>
            <p>When you need more than a digital friend: Moyo helps you identify challenges and suggests licensed therapists from the ChatWithFriends ecosystem. Seamlessly connect to professionals who can offer the support you need.</p>
          </div>
        </div>
      </div>

      {/* Fourth Section */}
      <div id="fourthSection" className={`${styles.fourthContainer} ${fourthSectionVisible ? styles.visible : ''}`}>
        <div className={styles.advancedBackground}>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={styles.floatingOrb}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 10}s`
              }}
            />
          ))}
        </div>

        <div className={styles.fourthContent}>
          <h2 className={styles.fourthTitle}>Experience Moyo's Unique Capabilities</h2>

          {/* First Feature Grid */}
          <div className={styles.advancedFeaturesGrid}>
            {[
              {
                icon: <Heart className={styles.featureIcon} />,
                title: "Empathy Engine",
                description: "Harness the power of AI-driven emotional intelligence to foster deep and meaningful interactions."
              },
              {
                icon: <Shield className={styles.featureIcon} />,
                title: "Privacy First",
                description: "Moyo ensures that all conversations remain secure, confidential, and ethically processed."
              },
              {
                icon: <Compass className={styles.featureIcon} />,
                title: "Personalized Guidance",
                description: "Receive tailored recommendations and growth plans based on your unique emotional journey."
              },
              {
                icon: <Brain className={styles.featureIcon} />,
                title: "AI-Driven Insights",
                description: "Benefit from actionable insights derived from advanced sentiment and pattern recognition."
              }
            ].map((feature, index) => (
              <div
                key={index}
                className={`${styles.advancedFeatureCard} ${activeFeature === index ? styles.activeFeature : ''}`}
              >
                <div className={styles.advancedIconWrapper}>
                  {feature.icon}
                </div>
                <h3 className={styles.advancedFeatureTitle}>{feature.title}</h3>
                <p className={styles.advancedFeatureDescription}>{feature.description}</p>
                <div className={styles.featureHighlight} />
              </div>
            ))}
          </div>

          {/* Divider with Animation */}
          <div className={styles.sectionDivider}>
            <div className={styles.dividerLine} />
            <h3 className={styles.dividerText}>Transformative Features for You</h3>
            <div className={styles.dividerLine} />
          </div>

          {/* Second Feature Grid */}
          <div className={styles.advancedFeaturesGridSecond}>
            {[
              {
                icon: <Workflow className={styles.featureIcon} />,
                title: "Dynamic Adaptability",
                description: "Moyo learns and evolves with your needs, ensuring continuous and personalized support."
              },
              {
                icon: <Database className={styles.featureIcon} />,
                title: "Knowledgeable Companion",
                description: "Access a vast repository of knowledge for guidance, encouragement, and inspiration."
              },
              {
                icon: <Layers className={styles.featureIcon} />,
                title: "Holistic Growth Tools",
                description: "Integrate mental, emotional, and personal development strategies into your daily life."
              },
              {
                icon: <AlertCircle className={styles.featureIcon} />,
                title: "Real-Time Support",
                description: "Get immediate assistance and support whenever you need it, 24/7."
              }
            ].map((feature, index) => (
              <div
                key={index}
                className={`${styles.advancedFeatureCardSecond} ${activeFeature === index + 4 ? styles.activeFeature : ''}`}
              >
                <div className={styles.advancedIconWrapperSecond}>
                  {feature.icon}
                </div>
                <h3 className={styles.advancedFeatureTitle}>{feature.title}</h3>
                <p className={styles.advancedFeatureDescription}>{feature.description}</p>
                <div className={styles.featureHighlightSecond} />
              </div>
            ))}
          </div>

          <div className={styles.orbitalAnimation}>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={styles.orbit}
                style={{
                  transform: `rotateX(${60 + i * 30}deg) rotateY(${i * 45}deg)`
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;