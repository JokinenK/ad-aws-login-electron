export interface SAMPResponse {
  "samlp:Response": SamlpResponse;
}

export interface SamlpResponse {
  $:              SamlpResponseClass;
  Issuer:         Issuer[];
  "samlp:Status": SamlpStatus[];
  Assertion:      AssertionElement[];
}

export interface SamlpResponseClass {
  ID:            string;
  Version:       string;
  IssueInstant:  Date;
  Destination:   string;
  "xmlns:samlp": string;
}

export interface AssertionElement {
  $:                  Assertion;
  Issuer:             string[];
  Signature:          SignatureElement[];
  Subject:            Subject[];
  Conditions:         ConditionElement[];
  AttributeStatement: AttributeStatement[];
  AuthnStatement:     AuthnStatementElement[];
}

export interface Assertion {
  ID:           string;
  IssueInstant: Date;
  Version:      string;
  xmlns:        string;
}

export interface AttributeStatement {
  Attribute: AttributeElement[];
}

export interface AttributeElement {
  $:              Attribute;
  AttributeValue: string[];
}

export interface Attribute {
  Name: string;
}

export interface AuthnStatementElement {
  $:            AuthnStatement;
  AuthnContext: AuthnContext[];
}

export interface AuthnStatement {
  AuthnInstant: Date;
  SessionIndex: string;
}

export interface AuthnContext {
  AuthnContextClassRef: string[];
}

export interface ConditionElement {
  $:                   Condition;
  AudienceRestriction: AudienceRestriction[];
}

export interface Condition {
  NotBefore:    Date;
  NotOnOrAfter: Date;
}

export interface AudienceRestriction {
  Audience: string[];
}

export interface SignatureElement {
  $:              Signature;
  SignedInfo:     SignedInfo[];
  SignatureValue: string[];
  KeyInfo:        KeyInfo[];
}

export interface Signature {
  xmlns: string;
}

export interface KeyInfo {
  X509Data: X509Datum[];
}

export interface X509Datum {
  X509Certificate: string[];
}

export interface SignedInfo {
  CanonicalizationMethod: CanonicalizationMethodElement[];
  SignatureMethod:        CanonicalizationMethodElement[];
  Reference:              ReferenceElement[];
}

export interface CanonicalizationMethodElement {
  $: CanonicalizationMethod;
}

export interface CanonicalizationMethod {
  Algorithm: string;
}

export interface ReferenceElement {
  $:            Reference;
  Transforms:   Transform[];
  DigestMethod: CanonicalizationMethodElement[];
  DigestValue:  string[];
}

export interface Reference {
  URI: string;
}

export interface Transform {
  Transform: CanonicalizationMethodElement[];
}

export interface Subject {
  NameID:              NameIDElement[];
  SubjectConfirmation: SubjectConfirmationElement[];
}

export interface NameIDElement {
  _: string;
  $: NameID;
}

export interface NameID {
  Format: string;
}

export interface SubjectConfirmationElement {
  $:                       SubjectConfirmation;
  SubjectConfirmationData: SubjectConfirmationDatumElement[];
}

export interface SubjectConfirmation {
  Method: string;
}

export interface SubjectConfirmationDatumElement {
  $: SubjectConfirmationDatum;
}

export interface SubjectConfirmationDatum {
  NotOnOrAfter: Date;
  Recipient:    string;
}

export interface Issuer {
  _: string;
  $: Signature;
}

export interface SamlpStatus {
  "samlp:StatusCode": SamlpStatusCodeElement[];
}

export interface SamlpStatusCodeElement {
  $: SamlpStatusCode;
}

export interface SamlpStatusCode {
  Value: string;
}
