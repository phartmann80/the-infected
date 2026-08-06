# Signing and Fingerprints

## Signing Context A — Local Export Preset [Placeholder]

No release keystore is configured in `export_presets.cfg`. The local preset references `~/.android/debug.keystore` (Godot default debug key). Suitable for local development only.

| Field | Value |
| --- | --- |
| Signing source | Godot default debug keystore (local preset only) |
| Certificate subject | Android Debug (auto-generated) |
| Algorithm | RSA (default) |
| Key size | 2048-bit (default) |
| Expiry | 25 years from creation (debug default) |
| SHA-1 | Not recorded (requires keytool -list on the actual build machine) |
| SHA-256 | Not recorded (requires keytool -list on the actual build machine) |
| Status | Temporary dev key — not suitable for release |

## Signing Context B — CI APK [Implemented but physical-device-unverified]

The Android Prototype workflow (`.github/workflows/android-prototype.yml`) decodes a protected development JKS from GitHub Secrets and signs the APK with apksigner. This is **not** the Godot default debug key.

### Certificate Details

| Field | Value |
| --- | --- |
| Signing source | Protected development JKS from GitHub Secrets (`ANDROID_DEV_KEYSTORE_BASE64`) |
| Secret inputs | `ANDROID_DEV_KEYSTORE_BASE64`, `ANDROID_DEV_KEY_ALIAS`, `ANDROID_DEV_STORE_PASSWORD`, `ANDROID_DEV_KEY_PASSWORD` |
| Signing command | `apksigner sign --ks $SIGNING_KEYSTORE --ks-type JKS` |
| Verification command | `apksigner verify --verbose --print-certs` |
| Certificate subject DN | `CN=The Infected Development, O=The Infected, C=US` |
| Certificate issuer DN | `CN=The Infected Development, O=The Infected, C=US` |
| Certificate SHA-1 | `10a6508f9373d09280122688fac115d7449efa10` |
| Certificate SHA-256 | `fa71008890aff510f054507409788c9b0b81643d1f69487d7be3cf40bcf1a46` |
| Certificate serial | `18A8E0` |
| Certificate not before | Jul 16 23:47:24 2026 GMT |
| Certificate not after | Jul 13 23:47:24 2036 GMT |
| Key algorithm | RSA |
| Key size | 2048 bits |
| Signing schemes verified | v3 (APK Signature Scheme v3) = true; v1 (JAR) = false; v2 = false; v3.1 = false; v4 = false |
| Number of signers | 1 |
| Status | **Development signing certificate** — not the future Google Play production signing identity |

### Commands Used to Extract Certificate Details

The certificate details above were extracted using two complementary commands on the CI build machine:

**1. apksigner** (fingerprints, signing schemes, verification):

```bash
apksigner verify --verbose --print-certs the-infected-debug.apk
```

This command outputs:
- Signer certificate subject DN
- Signer certificate issuer DN
- Signer certificate SHA-1
- Signer certificate SHA-256
- Signing schemes verified

**2. keytool** (serial number, validity dates, key algorithm, key size):

```bash
keytool -list -v \
  -keystore "$SIGNING_KEYSTORE" \
  -alias "$ANDROID_DEV_KEY_ALIAS"
```

This command outputs:
- Certificate serial number
- Certificate validity dates (Not Before / Not After)
- Key algorithm and size
- Certificate fingerprints (SHA-1, SHA-256)

Alternative (export public cert only, no keystore contents exposed):

```bash
keytool -exportcert -rfc \
  -keystore "$SIGNING_KEYSTORE" \
  -alias "$ANDROID_DEV_KEY_ALIAS" |
openssl x509 -noout \
  -subject -issuer -serial -dates \
  -fingerprint -sha1 -fingerprint -sha256
```

Certificate validity dates (not before / not after) were obtained from the CI workflow log output and the keytool listing.

**This is the development signing certificate, not the future Google Play production signing identity.**

Note: The actual keystore, passwords, and private key material are NOT included in this evidence file. Only the public certificate fields are documented above. The keystore is stored as a GitHub Actions secret and is never exposed in the repository or build logs.

## Release / Upload Certificate [Missing]

No release keystore exists. Must be created in Phase 1.

### Recommendations

- Create dedicated `the-infected-upload.jks` keystore
- Store securely outside the repository
- Document alias, creation date, expiry, SHA-1, SHA-256
- Never commit to GitHub
- Back up securely with a documented recovery procedure

## Google Play App-Signing Certificate [Missing]

Not applicable until Play Store submission.