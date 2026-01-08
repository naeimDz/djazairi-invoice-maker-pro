
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translations
const resources = {
  ar: {
    translation: {
      "appTitle": "مُنشئ الفواتير الجزائري PRO",
      "appSubtitle": "أداة احترافية لإنشاء الفواتير، مصممة خصيصاً للسوق الجزائري بدعم كامل للغات العربية والفرنسية والإنجليزية",
      "tabs": {
        "edit": "تعديل الفاتورة",
        "preview": "معاينة الفاتورة"
      },
      "common": {
        "autoSaved": "تم الحفظ تلقائياً",
        "backToEdit": "الرجوع للتعديل",
        "confirmDelete": "هل أنت متأكد من حذف هذه الفاتورة نهائياً؟"
      },
      "archive": {
        "description": "تتبع وادر فواتيرك الصادرة بكل سهولة من مكان واحد.",
        "searchPlaceholder": "ابحث بالرقم أو اسم العميل...",
        "emptyTitle": "لا توجد فواتير بعد",
        "emptyDesc": "ابدأ بإنشاء أول فاتورة احترافية لك اليوم من قسم الفواتير.",
        "statusAll": "الكل"
      },
      "settings": {
        "title": "إعدادات راحة البال",
        "documentLanguage": "لغة الوثيقة",
        "defaults": "الإعدادات الافتراضية",
        "formatting": "التنسيق و الأرقام",
        "branding": "الهوية التجارية",
        "behavior": "سلوك المعاينة",
        "description": "خصص تجربتك المحلية. لا سحابة، لا تتبع.",
        "safetyTitle": "ثقة التاجر الجزائري",
        "safetyDesc": "نحن نعطي الأولوية لخصوصيتك قبل كل شيء. بياناتك لا تغادر هذا الجهاز أبداً. من خلال تخزين الإعدادات محلياً، نضمن أن يظل عملك ملكك وحدك.",
        "autoSaved": "تم الحفظ تلقائياً",
        "defaultVatRate": "نسبة الضريبة الافتراضية (%)",
        "defaultFooter": "تذييل الصفحة الافتراضي",
        "numberSpacing": "تنسيق الأرقام",
        "numberSpacingSpace": "95 000 (فراغ)",
        "numberSpacingComma": "95,000 (فاصلة)",
        "numberSpacingNone": "95000 (بدون)",
        "currencyPlacement": "موقع العملة",
        "currencyBefore": "قبل المبلغ",
        "currencyAfter": "بعد المبلغ",
        "uploadLogo": "رفع الشعار",
        "logoAlignment": "محاذاة الشعار",
        "alignLeft": "يسار",
        "alignCenter": "وسط",
        "alignRight": "يمين",
        "vatBehavior": "عرض الضريبة (TVA)",
        "vatShow": "إظهار التفاصيل",
        "vatHide": "إخفاء (نفسياً)",
        "vatInclusive": "شاملة في سعر الوحدة",
        "saveSuccess": "تم حفظ الإعدادات بنجاح",
        "recallLast": "استدعاء آخر عميل",
        "duplicate": "نسخ الفاتورة",
        "status": "حالة الفاتورة",
        "statusDraft": "مسودة",
        "statusSent": "تم الإرسال",
        "statusPaid": "تم الدفع"
      },
      "invoiceHeader": {
        "title": "فاتورة",
        "date": "تاريخ الإصدار",
        "number": "رقم الفاتورة",
        "unspecified": "غير محدد"
      },
      "customerInfo": {
        "title": "معلومات العميل (المشتري)",
        "namePlaceholder": "اسم المؤسسة أو الشخص",
        "addressPlaceholder": "العنوان الكامل (الولاية، البلدية...)"
      },
      "invoiceItem": {
        "description": "تعيين السلعة أو الخدمة",
        "quantity": "الكمية",
        "price": "سعر الوحدة",
        "total": "المبلغ الإجمالي",
        "addItem": "إضافة بند جديد",
        "subtotal": "المبلغ الصافي (HT)",
        "tax": "الرسم على القيمة المضافة (TVA)",
        "grandTotal": "المبلغ الإجمالي (TTC)",
        "delete": "حذف",
        "currency": "د.ج"
      },
      "buttons": {
        "previewInvoice": "معاينة",
        "print": "طباعة الفاتورة",
        "save": "حفظ كـ مسودة",
        "download": "تحميل PDF"
      },
      "preview": {
        "thankYou": "شكراً لثقتكم بنا. نأمل التعامل معكم مجدداً",
        "items": "بنود الفاتورة"
      },
      "navigation": {
        "dashboard": "الرئيسية",
        "invoices": "الفواتير",
        "settings": "الإعدادات",
        "help": "المساعدة"
      }
    }
  },
  en: {
    translation: {
      "appTitle": "Djazairi Invoice Maker PRO",
      "appSubtitle": "Professional invoice generator tailored for the Algerian market with multi-language support",
      "tabs": {
        "edit": "Edit Invoice",
        "preview": "Live Preview"
      },
      "common": {
        "autoSaved": "Auto-saved",
        "backToEdit": "Back to Editing",
        "confirmDelete": "Are you sure you want to delete this invoice permanently?"
      },
      "archive": {
        "description": "Track and manage your issued invoices with ease from one place.",
        "searchPlaceholder": "Search by number or customer name...",
        "emptyTitle": "No Invoices Yet",
        "emptyDesc": "Start creating your first professional invoice today from the invoices section.",
        "statusAll": "All"
      },
      "settings": {
        "title": "Peace of Mind Settings",
        "documentLanguage": "Invoice Language",
        "defaults": "Defaults",
        "formatting": "Formatting & Numbers",
        "branding": "Shop Branding",
        "behavior": "Preview Behavior",
        "description": "Customize your local experience. No cloud, no tracking.",
        "safetyTitle": "Algerian Merchant Trust",
        "safetyDesc": "We prioritize your privacy above all. Your data never leaves this device. By storing settings locally, we ensure your business remains your business.",
        "autoSaved": "Auto-Saved",
        "defaultVatRate": "Default VAT Rate (%)",
        "defaultFooter": "Default Footer content",
        "numberSpacing": "Number Spacing",
        "numberSpacingSpace": "95 000 (Space)",
        "numberSpacingComma": "95,000 (Comma)",
        "numberSpacingNone": "95000 (None)",
        "currencyPlacement": "Currency Placement",
        "currencyBefore": "Before Amount",
        "currencyAfter": "After Amount",
        "uploadLogo": "Upload Logo",
        "logoAlignment": "Logo Alignment",
        "alignLeft": "Left",
        "alignCenter": "Center",
        "alignRight": "Right",
        "vatBehavior": "VAT (TVA) Behavior",
        "vatShow": "Show Details",
        "vatHide": "Hide (Psychological)",
        "vatInclusive": "VAT Inclusive in Price",
        "saveSuccess": "Settings saved successfully",
        "recallLast": "Recall Last Customer",
        "duplicate": "Duplicate Invoice",
        "status": "Invoice Status",
        "statusDraft": "Draft",
        "statusSent": "Sent",
        "statusPaid": "Paid"
      },
      "invoiceHeader": {
        "title": "INVOICE",
        "date": "Issue Date",
        "number": "Invoice No.",
        "unspecified": "N/A"
      },
      "customerInfo": {
        "title": "Bill To / Customer Info",
        "namePlaceholder": "Company or Client Name",
        "addressPlaceholder": "Full Address"
      },
      "invoiceItem": {
        "description": "Description of Items",
        "quantity": "Qty",
        "price": "Unit Price",
        "total": "Amount",
        "addItem": "Add New Line",
        "subtotal": "Subtotal (Excl. Tax)",
        "tax": "VAT",
        "grandTotal": "Total Amount (Incl. Tax)",
        "delete": "Remove",
        "currency": "DZD"
      },
      "buttons": {
        "previewInvoice": "Preview",
        "print": "Print Invoice",
        "save": "Save Draft",
        "download": "Download PDF"
      },
      "preview": {
        "thankYou": "Thank you for your business. We appreciate your trust.",
        "items": "Invoice Items"
      },
      "navigation": {
        "dashboard": "Dashboard",
        "invoices": "Invoices",
        "settings": "Settings",
        "help": "Support"
      }
    }
  },
  fr: {
    translation: {
      "appTitle": "Djazairi Invoice Maker PRO",
      "appSubtitle": "Générateur de factures professionnel conçu pour le marché algérien, supportant l'Arabe, le Français et l'Anglais",
      "tabs": {
        "edit": "Modifier la facture",
        "preview": "Aperçu en direct"
      },
      "common": {
        "autoSaved": "Enregistré auto.",
        "backToEdit": "Retour à l'édition",
        "confirmDelete": "Êtes-vous sûr de vouloir supprimer cette facture définitivement ?"
      },
      "archive": {
        "description": "Suivez et gérez vos factures émises facilement depuis un seul endroit.",
        "searchPlaceholder": "Chercher par numéro ou nom du client...",
        "emptyTitle": "Aucune facture trouvée",
        "emptyDesc": "Commencez à créer votre première facture professionnelle dès aujourd'hui.",
        "statusAll": "Tout"
      },
      "settings": {
        "title": "Paramètres Sérénité",
        "documentLanguage": "Langue du document",
        "defaults": "Défauts",
        "formatting": "Formatage & Nombres",
        "branding": "Identité Visuelle",
        "behavior": "Comportement",
        "description": "Personnalisez votre expérience locale. Pas de cloud, pas de suivi.",
        "safetyTitle": "Confiance du Commerçant Algérien",
        "safetyDesc": "Nous accordons la priorité à votre vie privée avant tout. Vos données ne quittent jamais cet appareil. En stockant les paramètres localement, nous garantissons que votre entreprise reste votre entreprise.",
        "autoSaved": "Sauveguardé Auto.",
        "defaultVatRate": "Taux TVA par défaut (%)",
        "defaultFooter": "Pied de page par défaut",
        "numberSpacing": "Séparateur de milliers",
        "numberSpacingSpace": "95 000 (Espace)",
        "numberSpacingComma": "95,000 (Virgule)",
        "numberSpacingNone": "95000 (Aucun)",
        "currencyPlacement": "Position de la devise",
        "currencyBefore": "Avant le montant",
        "currencyAfter": "Après le montant",
        "uploadLogo": "Charger le Logo",
        "logoAlignment": "Alignement du Logo",
        "alignLeft": "Gauche",
        "alignCenter": "Centre",
        "alignRight": "Droite",
        "vatBehavior": "Affichage de la TVA",
        "vatShow": "Afficher les détails",
        "vatHide": "Masquer (Psychologique)",
        "vatInclusive": "TVA incluse dans le prix",
        "saveSuccess": "Paramètres enregistrés avec succès",
        "recallLast": "Rappeler le dernier client",
        "duplicate": "Dupliquer la facture",
        "status": "Statut de la facture",
        "statusDraft": "Brouillon",
        "statusSent": "Envoyée",
        "statusPaid": "Payée"
      },
      "invoiceHeader": {
        "title": "FACTURE",
        "date": "Date d'émission",
        "number": "N° de Facture",
        "unspecified": "Non spécifié"
      },
      "customerInfo": {
        "title": "Facturé à / Informations Client",
        "namePlaceholder": "Nom de l'entreprise ou du client",
        "addressPlaceholder": "Adresse complète"
      },
      "invoiceItem": {
        "description": "Désignation des produits ou services",
        "quantity": "Qté",
        "price": "Prix Unitaire",
        "total": "Montant",
        "addItem": "Ajouter une ligne",
        "subtotal": "Total HT",
        "tax": "TVA",
        "grandTotal": "Total TTC",
        "delete": "Supprimer",
        "currency": "DZD"
      },
      "buttons": {
        "previewInvoice": "Aperçu",
        "print": "Imprimer la facture",
        "save": "Enregistrer",
        "download": "Télécharger PDF"
      },
      "preview": {
        "thankYou": "Merci de votre confiance. Au plaisir de retravailler avec vous.",
        "items": "Détails de la facture"
      },
      "navigation": {
        "dashboard": "Tableau de bord",
        "invoices": "Factures",
        "settings": "Paramètres",
        "help": "Aide & Support"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "ar", // default language
    fallbackLng: "ar",
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
