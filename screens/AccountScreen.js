import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import { getAccount, updateAccount } from '../api';

export default function AccountScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user, logout } = useUser();
  const email = user?.email || route.params?.email || '';

  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDossier, setShowDossier] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);

  const [showEdit, setShowEdit] = useState(false);
  const [editNom, setEditNom] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState('');

  const handleLogout = () => {
    logout();
    const root = navigation.getParent();
    if (root) {
      root.reset({ index: 0, routes: [{ name: 'Home' }] });
    }
  };

  useEffect(() => {
    if (!email) return;
    let cancelled = false;
    setLoading(true);
    setError('');
    getAccount(email)
      .then((acc) => {
        if (!cancelled) {
          setAccount(acc);
          if (acc) setEditNom(acc.nom || '');
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e.message || 'Unable to load account');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [email]);

  const handleSaveProfile = async () => {
    setIsUpdating(true);
    setUpdateMsg('');
    try {
      const data = {};
      if (editNom !== account?.nom) data.nom = editNom;
      if (editPassword) data.password = editPassword;

      if (Object.keys(data).length === 0) {
        setUpdateMsg('Aucune modification à enregistrer.');
        setIsUpdating(false);
        return;
      }

      const updated = await updateAccount(email, data);
      setAccount(updated);
      setEditPassword('');
      setUpdateMsg('Profil mis à jour avec succès !');
    } catch (e) {
      setUpdateMsg(e.message || 'Erreur lors de la mise à jour');
    } finally {
      setIsUpdating(false);
    }
  };

  const dossierSections = useMemo(() => ([
    {
      title: 'Étape 1',
      fields: [
        { label: 'Nom', value: account?.nom },
        { label: 'Date de naissance', value: account?.dateNaissance },
        { label: 'Email', value: account?.mail },
        { label: 'Nom d’utilisateur', value: account?.username },
        { label: 'Nombre d’enfants', value: account?.nombreEnfants },
      ],
    },
    {
      title: 'Étape 2',
      fields: [
        { label: 'DDR', value: account?.ddr },
        { label: 'Semaine de grossesse', value: account?.semaineGrossesse },
        { label: 'Grossesses précédentes', value: account?.nombreGrossessesPrecedentes },
        { label: 'Accouchements', value: account?.nombreAccouchements },
        { label: 'Type d’accouchement', value: account?.typeAccouchement },
        { label: 'Complications (oui/non)', value: account?.complicationsOuiNon },
        { label: 'Complications détaillées', value: account?.complicationsDetails },
      ],
    },
    {
      title: 'Étape 3',
      fields: [
        { label: 'Nausées/vomissements', value: account?.nauseesVomissements },
        { label: 'Fatigue excessive', value: account?.fatigueExcessive },
        { label: 'Douleurs abdominales', value: account?.douleursAbdominales },
        { label: 'Prise de médicaments', value: account?.priseMedicaments },
        { label: 'Médicaments détaillés', value: account?.medicamentsDetails },
        { label: 'Antécédents de fausses couches', value: account?.antecedentsFaussesCouches },
      ],
    },
    {
      title: 'Étape 4',
      fields: [
        { label: 'Gonflement', value: account?.gonflement },
        { label: 'Douleurs dorsales', value: account?.douleursDorsales },
        { label: 'Mouvement fœtal', value: account?.mouvementFoetus },
        { label: 'Test diabète', value: account?.testDiabete },
        { label: 'Pression artérielle', value: account?.pressionArterielle },
      ],
    },
    {
      title: 'Étape 5',
      fields: [
        { label: 'Contractions fréquentes', value: account?.frequenceContractions },
        { label: 'Perte de liquide', value: account?.perteLiquide },
        { label: 'Saignement vaginal', value: account?.saignementVaginal },
        { label: 'Préparation accouchement', value: account?.preparationAccouchement },
        { label: 'Sommeil/anxiété', value: account?.sommeilAnxiete },
      ],
    },
    {
      title: 'Étape 6',
      fields: [
        { label: 'Diabète avant', value: account?.diabeteAvant },
        { label: 'Hypertension', value: account?.hypertension },
        { label: 'Thyroïde', value: account?.thyroide },
        { label: 'Cardiaques', value: account?.cardiaques },
        { label: 'Antécédents familiaux', value: account?.antecedentsFamiliaux },
        { label: 'Vaccins', value: account?.vaccins == null ? '' : (typeof account.vaccins === 'string' ? account.vaccins : JSON.stringify(account.vaccins)) },
      ],
    },
    {
      title: 'Étape 7',
      fields: [
        { label: 'Tabac/chicha', value: account?.tabacChicha },
        { label: 'Alcool', value: account?.alcool },
        { label: 'Activité physique', value: account?.activitePhysique },
        { label: 'Régime alimentaire', value: account?.regimeAlimentaire },
        { label: 'Soutien familial', value: account?.soutienFamilial },
        { label: 'Préférence suivi', value: account?.preferenceSuivi },
      ],
    },
    {
      title: 'Étape 8',
      fields: [
        { label: 'Suivi poids', value: account?.suiviPoids },
        { label: 'Suivi tension', value: account?.suiviTension },
        { label: 'Suivi mouvements fœtaux', value: account?.suiviMouvementsFoetaux },
        { label: 'Notifications RDV', value: account?.notificationsRdv },
        { label: 'Infos par trimestre', value: account?.infosParTrimestre },
      ],
    },
  ]), [account]);

  const formatValue = (v) => {
    if (v === undefined || v === null || v === '') return '-';
    return typeof v === 'string' ? v : String(v);
  };

  const escapeHtml = (str) => {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const buildDossierHtml = () => {
    const header = `
      <h1 style="margin:0 0 6px 0; font-size:22px;">Dossier médical</h1>
      <p style="margin:0 0 14px 0; color:#6b5b8c;">${escapeHtml(email || '')}</p>
      <div style="margin-bottom:16px;">
        <div><b>Nom</b>: ${escapeHtml(account?.nom || '')}</div>
        <div><b>Date de naissance</b>: ${escapeHtml(account?.dateNaissance || '')}</div>
        <div><b>DDR</b>: ${escapeHtml(account?.ddr || '')}</div>
      </div>
    `;

    const sectionsHtml = dossierSections
      .map((section) => {
        const fieldsHtml = section.fields
          .map((f) => {
            const value = formatValue(f.value);
            return `
              <div style="display:flex; gap:12px; padding:6px 0; border-bottom:1px solid #eee;">
                <div style="flex:1; font-weight:700; color:#6b5b8c;">${escapeHtml(f.label)}</div>
                <div style="flex:1; text-align:right; white-space:pre-wrap;">${escapeHtml(value)}</div>
              </div>
            `;
          })
          .join('');

        return `
          <div style="margin-top:18px;">
            <h2 style="font-size:16px; margin:0 0 10px 0; color:#9A75F0;">${escapeHtml(section.title)}</h2>
            ${fieldsHtml}
          </div>
        `;
      })
      .join('');

    return `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { font-family: Helvetica, Arial, sans-serif; padding: 18px; color: #1A1824; }
          </style>
        </head>
        <body>
          ${header}
          ${sectionsHtml}
        </body>
      </html>
    `;
  };

  const exportDossierAsPdf = async () => {
    if (!account) return;
    setExportingPdf(true);
    setError('');
    try {
      const html = buildDossierHtml();
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf' });
    } catch (e) {
      setError(e.message || 'Export PDF impossible');
    } finally {
      setExportingPdf(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Profil</Text>
          <Text style={styles.subtitle}>Dossier médical (réponses)</Text>
        </View>

        <View style={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{(account?.nom || email || 'U')?.[0]?.toUpperCase()}</Text>
          </View>
          <Text style={styles.name}>{account?.nom || 'Utilisateur'}</Text>
          {email ? <Text style={styles.info}>{email}</Text> : null}
          {user?.ddr ? <Text style={styles.info}>DDR : {user.ddr}</Text> : null}
          {user?.semaineGrossesse ? <Text style={styles.info}>Semaine : {user.semaineGrossesse} SA</Text> : null}
        </View>

        <View style={styles.actionsCard}>
          <TouchableOpacity style={styles.actionItem} onPress={() => setShowEdit((v) => !v)}>
            <Text style={styles.actionIcon}>⚙️</Text>
            <Text style={styles.actionText}>Paramètres (Nom / Mot de passe)</Text>
            <Text style={styles.actionArrow}>{showEdit ? '˄' : '˃'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionItem, { borderBottomWidth: 0 }]} onPress={() => setShowDossier((v) => !v)}>
            <Text style={styles.actionIcon}>🗂️</Text>
            <Text style={styles.actionText}>Ouvrir le dossier médical</Text>
            <Text style={styles.actionArrow}>{showDossier ? '˄' : '˃'}</Text>
          </TouchableOpacity>
        </View>

        {showEdit ? (
          <View style={styles.dossierCard}>
            <Text style={styles.dossierTitle}>Modifier le profil</Text>
            <View style={styles.editForm}>
              <Text style={styles.inputLabel}>Nouveau nom</Text>
              <TextInput
                style={styles.input}
                value={editNom}
                onChangeText={setEditNom}
                placeholder="Votre nom"
                placeholderTextColor="#A09CAB"
              />
              <Text style={styles.inputLabel}>Nouveau mot de passe</Text>
              <TextInput
                style={styles.input}
                value={editPassword}
                onChangeText={setEditPassword}
                placeholder="Nouveau mot de passe (optionnel)"
                placeholderTextColor="#A09CAB"
                secureTextEntry
              />
              {updateMsg ? <Text style={styles.updateMsgText}>{updateMsg}</Text> : null}
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile} disabled={isUpdating}>
                <Text style={styles.saveBtnText}>{isUpdating ? 'Enregistrement...' : 'Enregistrer les modifications'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color="#9A75F0" />
          </View>
        ) : null}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {showDossier && account ? (
          <View style={styles.dossierCard}>
            <TouchableOpacity
              style={styles.pdfBtn}
              onPress={exportDossierAsPdf}
              disabled={exportingPdf}
            >
              <Text style={styles.pdfBtnText}>
                {exportingPdf ? 'Génération du PDF...' : 'Exporter / Partager PDF'}
              </Text>
            </TouchableOpacity>
            <Text style={styles.dossierTitle}>Fiche médicale (toutes les réponses)</Text>
            <ScrollView style={styles.dossierScroll}>
              {dossierSections.map((s) => (
                <View key={s.title} style={styles.sectionBlock}>
                  <Text style={styles.sectionTitle}>{s.title}</Text>
                  {s.fields.map((f) => (
                    <View key={f.label} style={styles.fieldRow}>
                      <Text style={styles.fieldLabel}>{f.label}</Text>
                      <Text style={styles.fieldValue}>{formatValue(f.value)}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </ScrollView>
          </View>
        ) : null}

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EDECF9' },
  scrollContent: {
    paddingBottom: 100,
  },
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: 4,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1824',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#8A8696',
    fontWeight: '500',
    marginTop: 4,
  },
  content: {
    paddingHorizontal: 24,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#8C72FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#9A75F0',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1824',
    marginBottom: 4,
  },
  info: {
    fontSize: 15,
    color: '#8A8696',
    fontWeight: '500',
    marginBottom: 4,
  },
  actionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 8,
    marginBottom: 24,
    shadowColor: '#8C72FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F7F6FB',
  },
  actionIcon: {
    fontSize: 20,
    width: 32,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1824',
    flex: 1,
  },
  actionArrow: {
    fontSize: 16,
    color: '#9A75F0',
    fontWeight: '700',
  },
  logoutBtn: {
    backgroundColor: '#FFEBF0',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  logoutText: {
    color: '#F44336',
    fontSize: 16,
    fontWeight: '700',
  },
  loadingWrap: {
    paddingVertical: 14,
  },
  errorText: {
    color: '#B84A4A',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },

  dossierCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E6DCFF',
    marginBottom: 16,
    shadowColor: '#8C72FF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 2,
  },
  dossierTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1A1824',
    marginBottom: 12,
  },
  dossierScroll: {
    maxHeight: 450,
  },
  sectionBlock: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#9A75F0',
    marginBottom: 6,
  },
  fieldRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1EEFF',
  },
  fieldLabel: {
    flex: 1,
    color: '#8A8696',
    fontWeight: '800',
    fontSize: 13,
  },
  fieldValue: {
    flex: 1,
    color: '#1A1824',
    fontWeight: '700',
    fontSize: 13,
    textAlign: 'right',
  },
  pdfBtn: {
    backgroundColor: '#9A75F0',
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  pdfBtnText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
  },
  editForm: {
    marginTop: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1824',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#F5F5FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1A1824',
    borderWidth: 1,
    borderColor: '#E6E4F0',
  },
  updateMsgText: {
    marginTop: 12,
    fontSize: 14,
    color: '#9A75F0',
    fontWeight: '600',
    textAlign: 'center',
  },
  saveBtn: {
    backgroundColor: '#9A75F0',
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
});

