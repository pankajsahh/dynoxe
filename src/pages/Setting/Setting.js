import React, { useCallback, useEffect, useRef, useState } from "react";

import "./index.scss";
import { useLocation } from "react-router-dom";
import axios from "axios";
import CONSTANTS from "../../utils/constant";
import usePageData from "../../helpers/pageApi";
import {
  FocusContext,
  setFocus,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import Loader from "../../components/Loader";

const Settings = (props) => {
  const { pathname } = useLocation();
  console.log(pathname, "pathname");
  let pageType = pathname?.split("/")[1];
  return (
    <div className="setting-container">
      {pageType == "terms" ? (
        <TermsPage />
      ) : pageType == "privacy" ? (
        <PrivacyPage />
      ) : pageType == "contact" ? (
        <ContactPage />
      ) : null}
    </div>
  );
};

const PrivacyPage = () => {

  let pptext = `<div>
<div>This Privacy Policy describes how Dynoxe ("we," "us," or "our") collects, uses, and discloses your personal information when you use our over-the-top (OTT) platform accessible at dynoxe.com</div>
<br />
<div>1. Information We Collect</div>
<br />
<div>We collect several types of information when you use the Platform, including:</div>
<br />
<div>Account Information: When you create an account on the Platform, we collect your email address, username, password (hashed and stored securely), and any other information you choose to provide, such as your name, profile picture, and billing information.</div>
<div>Usage Data: We collect information about how you use the Platform, such as the content you view, the time you spend watching content, and your device information (including IP address, operating system, and browser type).</div>
<div>Payment Information: If you subscribe to a paid service on the Platform, we may collect your payment information, such as your credit card number or billing address. This information is collected and processed by a third-party payment processor, and we do not store your full credit card details.</div>
<div>2. How We Use Your Information</div>
<br />
<div>We use the information we collect to:</div>
<br />
<div>Provide and operate the Platform</div>
<div>Create and manage your account</div>
<div>Send you marketing and promotional communications (with your consent)</div>
<div>Respond to your inquiries and support requests</div>
<div>Track and analyze usage trends on the Platform</div>
<div>Improve the Platform and develop new features</div>
<div>Comply with legal and regulatory requirements</div>
<div>3. Sharing Your Information</div>
<br />
<div>We may share your information with third-party service providers who help us operate the Platform, such as payment processors, content providers, and analytics providers. We will only share your information with these providers to the extent necessary to perform their services.</div>
<br />
<div>We may also disclose your information if required to do so by law or in the good faith belief that such disclosure is necessary to comply with a legal process, protect our rights, or protect the safety of others.</div>
<br />
<div>4. Data Retention</div>
<br />
<div>We will retain your information for as long as your account is active or as needed to provide you with the Platform. We may also retain your information for a longer period if required by law or to comply with our legal obligations.</div>
<br />
<div>5. Your Choices</div>
<br />
<div>You have certain choices regarding your information:</div>
<br />
<div>You can access and update your account information at any time.</div>
<div>You can unsubscribe from marketing and promotional communications by following the instructions in those communications.</div>
<div>You can delete your account by contacting us at support@dynoxe.com</div>
<div>6. Children's Privacy</div>
<br />
<div>Our Platform is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and you believe your child has provided us with personal information, please contact us at support@dynoxe.com</div>
<br />
<div>7. Security</div>
<br />
<div>We take reasonable measures to protect your information from unauthorized access, disclosure, alteration, or destruction. However, no internet transmission or electronic storage is completely secure. We cannot guarantee the security of your information.</div>
<br />
<div>8. Changes to This Privacy Policy</div>
<br />
<div>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on the Platform. You are advised to review this Privacy Policy periodically for any changes.</div>
<br />
<div>9. Contact Us</div>
<br />
<div>If you have any questions about this Privacy Policy, please contact us at support@dynoxe.com</div>
<br />
<div>Please note: This is a sample privacy policy and may need to be adapted to comply with specific laws and regulations in your jurisdiction. You should consult with an attorney to ensure that your privacy policy is compliant with all applicable laws.</div>
<br />
<div>For any questions or inquiries please reach out to DYNOXE support. Email: support@dynoxe.com</div>
</div>
<!-- Comments are visible in the HTML source only -->`;
let url = CONSTANTS.BASE_URL + "/terms";
  let title = "Privacy Policy";
  const scrollingAreaRef = useRef(null);
  const scrollHandler = useCallback(
    (props) => {
      if (props == "down") {
        if (scrollingAreaRef?.current) {
          try {
            scrollingAreaRef?.current?.scrollTo({
              top: scrollingAreaRef.current.scrollTop + 200,
              behavior: "smooth",
            });
          } catch (e) {}
          return false;
        }
      } else if (props == "up") {
        if (
          scrollingAreaRef?.current &&
          scrollingAreaRef.current.scrollTop > 0
        ) {
          try {
            scrollingAreaRef?.current?.scrollTo({
              top: scrollingAreaRef.current.scrollTop - 200,
              behavior: "smooth",
            });
          } catch (e) {}
          return false;
        }
      } else if (props == "left") {
        setFocus("MENU");
        return false;
      }
      return true;
    },
    [scrollingAreaRef]
  );
  return (
    <>
      {pptext ? (
        <div className="SelectedMenuViewer">
          <div className="centerInfo">
            <div className="Title">{title}</div>
            <div className="desc" ref={scrollingAreaRef}>
              <ScrollableTextArea
                content={pptext}
                isFocused={true}
                scrollHandler={scrollHandler}
              />
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};
const ContactPage = () => {
  return (
    <div className="SelectedMenuViewer">
      <div className="centerInfo">
        <div className="Title">Contact Us</div>
        <div className="desc contact">
          support@dynoxe.com
          </div>
      </div>
    </div>
  );
};
const TermsPage = () => {
  let url = CONSTANTS.BASE_URL + "/terms";
  let title = "Terms and Conditions";
  const { pageData, loading, error } = usePageData(url);

  const scrollingAreaRef = useRef(null);

  const scrollHandler = useCallback(
    (props) => {
      if (props == "down") {
        if (scrollingAreaRef?.current) {
          try {
            scrollingAreaRef?.current?.scrollTo({
              top: scrollingAreaRef.current.scrollTop + 200,
              behavior: "smooth",
            });
          } catch (e) {}
          return false;
        }
      } else if (props == "up") {
        if (
          scrollingAreaRef?.current &&
          scrollingAreaRef.current.scrollTop > 0
        ) {
          try {
            scrollingAreaRef?.current?.scrollTo({
              top: scrollingAreaRef.current.scrollTop - 200,
              behavior: "smooth",
            });
          } catch (e) {}
          return false;
        }
      } else if (props == "left") {
        setFocus("MENU");
        return false;
      }
      return true;
    },
    [scrollingAreaRef]
  );
  return (
    <>
      {pageData?.data?.termsdata ? (
        <div className="SelectedMenuViewer">
          <div className="centerInfo">
            <div className="Title">{title}</div>
            <div className="desc" ref={scrollingAreaRef}>
              <ScrollableTextArea
                content={pageData?.data?.termsdata}
                isFocused={true}
                scrollHandler={scrollHandler}
              />
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};

export const ScrollableTextArea = ({ content, isFocused, scrollHandler }) => {
  const { ref, focusSelf, focused } = useFocusable({
    onArrowPress: (props) => {
      return scrollHandler(props);
    },
  });
  useEffect(() => {
    if (isFocused) focusSelf();
  }, []);
  return (
    <>
      <div
        ref={ref}
        className={focused ? "focusedText" : ""}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </>
  );
};
export default Settings;
