import { useEffect, useRef } from 'react';
import { createNotification } from './services/notificationAPI';

// Simulated mock data to trigger time-based notifications
const mockEntities = {
  contracts: [
    { id: 'CON-EXP-30', name: 'Vendor Agreement', expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
    { id: 'CON-EXP-7', name: 'Software License', expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    { id: 'CON-REN-15', name: 'Office Lease', renewal: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) },
  ],
  obligations: [
    { id: 'OBL-DUE', description: 'Quarterly Payment to Vendor', dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) },
    { id: 'OBL-OVERDUE', description: 'Annual Security Audit', dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
  ],
  compliances: [
    { id: 'CMP-REM', name: 'Data Processing Addendum', nextAudit: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) }
  ]
};

const NotificationEngine = () => {
  const hasRun = useRef(false);

  useEffect(() => {
    // Ensure we only run this once per session/mount
    if (hasRun.current) return;
    hasRun.current = true;

    const checkAndTrigger = async () => {
      const storedKeys = JSON.parse(localStorage.getItem('triggered_notifications') || '{}');
      const newKeys = { ...storedKeys };

      const trigger = async (key, title, message) => {
        if (!newKeys[key]) {
          try {
            await createNotification({ title, message });
            newKeys[key] = true;
            window.dispatchEvent(new Event('notification-created'));
          } catch (err) {
            console.error('Failed to auto-trigger notification:', err);
          }
        }
      };

      // Check Contracts Expiry
      for (const c of mockEntities.contracts) {
        if (c.expiry) {
          const daysLeft = Math.ceil((c.expiry - new Date()) / (1000 * 60 * 60 * 24));
          if ([180, 90, 60, 30, 15, 7, 1].includes(daysLeft)) {
            await trigger(`exp_${c.id}_${daysLeft}`, 'Contract Expiry Reminder', `Contract ${c.id} (${c.name}) is expiring in ${daysLeft} days.`);
          }
        }
        if (c.renewal) {
          const daysLeft = Math.ceil((c.renewal - new Date()) / (1000 * 60 * 60 * 24));
          if ([30, 15, 7].includes(daysLeft)) {
            await trigger(`ren_${c.id}_${daysLeft}`, 'Renewal Reminder', `Contract ${c.id} (${c.name}) is due for renewal in ${daysLeft} days.`);
          }
        }
      }

      // Check Obligations
      for (const o of mockEntities.obligations) {
        const daysLeft = Math.ceil((o.dueDate - new Date()) / (1000 * 60 * 60 * 24));
        if (daysLeft === 1 || daysLeft === 0) {
          await trigger(`obl_due_${o.id}`, 'Obligation Due', `Obligation ${o.id} (${o.description}) is due soon.`);
        } else if (daysLeft < 0) {
          await trigger(`obl_overdue_${o.id}`, 'Obligation Overdue', `Obligation ${o.id} (${o.description}) is overdue by ${Math.abs(daysLeft)} days.`);
        }
      }

      // Check Compliance
      for (const comp of mockEntities.compliances) {
        const daysLeft = Math.ceil((comp.nextAudit - new Date()) / (1000 * 60 * 60 * 24));
        if (daysLeft <= 7 && daysLeft > 0) {
          await trigger(`cmp_rem_${comp.id}`, 'Compliance Reminder', `Compliance check for ${comp.id} (${comp.name}) is required in ${daysLeft} days.`);
        }
      }

      localStorage.setItem('triggered_notifications', JSON.stringify(newKeys));
    };

    // Timeout to allow app initialization and auth token processing
    setTimeout(checkAndTrigger, 3000);
  }, []);

  return null;
};

export default NotificationEngine;
