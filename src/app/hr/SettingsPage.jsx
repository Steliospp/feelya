import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/card';
import Button from '../../components/ui/button';
import Badge from '../../components/ui/badge';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[28px] font-semibold text-text-primary">Settings</h1>
        <p className="text-[15px] text-text-secondary mt-1">Organisation and billing settings</p>
      </div>

      {/* Org info */}
      <Card className="!p-5 mb-4">
        <h2 className="text-[16px] font-semibold text-text-primary mb-4">Organisation</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[13px] text-text-secondary">Company name</label>
            <input className="w-full mt-1 h-10 px-3 rounded-[12px] border border-border text-[14px] text-text-primary bg-surface focus:outline-none focus:border-primary" defaultValue={user?.companyName} />
          </div>
          <div>
            <label className="text-[13px] text-text-secondary">Admin email</label>
            <input className="w-full mt-1 h-10 px-3 rounded-[12px] border border-border text-[14px] text-text-primary bg-surface focus:outline-none focus:border-primary" defaultValue={user?.email} />
          </div>
        </div>
        <Button variant="primary" size="md" className="mt-4">Save changes</Button>
      </Card>

      {/* Billing */}
      <Card className="!p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[16px] font-semibold text-text-primary">Billing plan</h2>
          <Badge variant="success">Active</Badge>
        </div>
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-[28px] font-semibold text-text-primary">&pound;799</span>
          <span className="text-[14px] text-text-secondary">/ month</span>
        </div>
        <p className="text-[14px] text-text-secondary">Growth plan &mdash; Up to 500 employees</p>
        <Button variant="outline" size="md" className="mt-4">Manage billing</Button>
      </Card>

      {/* Workshop defaults */}
      <Card className="!p-5 mb-4">
        <h2 className="text-[16px] font-semibold text-text-primary mb-4">Workshop defaults</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[13px] text-text-secondary">Default seat cap</label>
            <input type="number" className="w-full mt-1 h-10 px-3 rounded-[12px] border border-border text-[14px] text-text-primary bg-surface focus:outline-none focus:border-primary" defaultValue="50" />
          </div>
          <div>
            <label className="text-[13px] text-text-secondary">Reminder before event</label>
            <select className="w-full mt-1 h-10 px-3 rounded-[12px] border border-border text-[14px] text-text-primary bg-surface focus:outline-none focus:border-primary">
              <option>1 hour</option>
              <option>24 hours</option>
              <option>48 hours</option>
            </select>
          </div>
        </div>
        <Button variant="primary" size="md" className="mt-4">Save defaults</Button>
      </Card>

      {/* Notifications */}
      <Card className="!p-5">
        <h2 className="text-[16px] font-semibold text-text-primary mb-4">Notification rules</h2>
        {['New employee requests', 'Workshop reminders', 'Weekly engagement digest', 'Billing updates'].map((rule) => (
          <label key={rule} className="flex items-center justify-between py-2.5 border-b border-border-light last:border-none cursor-pointer">
            <span className="text-[14px] text-text-primary">{rule}</span>
            <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary cursor-pointer" />
          </label>
        ))}
      </Card>
    </div>
  );
}
