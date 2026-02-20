import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/button';
import Badge from '../../components/ui/badge';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-[32px] font-semibold text-neutral-900 tracking-tight">Settings</h1>
        <p className="text-[15px] text-neutral-400 mt-1.5">Organisation and billing settings</p>
      </div>

      {/* Org info */}
      <section className="mb-8">
        <h2 className="text-[14px] font-semibold text-neutral-900 mb-4">Organisation</h2>
        <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-neutral-200/60">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-[12px] font-medium text-neutral-400 uppercase tracking-wider">Company name</label>
              <input
                className="w-full mt-2 h-11 px-4 rounded-xl border border-neutral-200 text-[14px] text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300 transition-all"
                defaultValue={user?.companyName}
              />
            </div>
            <div>
              <label className="text-[12px] font-medium text-neutral-400 uppercase tracking-wider">Admin email</label>
              <input
                className="w-full mt-2 h-11 px-4 rounded-xl border border-neutral-200 text-[14px] text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300 transition-all"
                defaultValue={user?.email}
              />
            </div>
          </div>
          <div className="pt-5 mt-5 border-t border-neutral-100">
            <Button variant="primary" size="md">Save changes</Button>
          </div>
        </div>
      </section>

      {/* Billing */}
      <section className="mb-8">
        <h2 className="text-[14px] font-semibold text-neutral-900 mb-4">Billing plan</h2>
        <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-neutral-200/60">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[32px] font-semibold text-neutral-900 tracking-tight">&pound;799</span>
                <span className="text-[14px] text-neutral-400">/ month</span>
              </div>
              <p className="text-[14px] text-neutral-500 mt-1">Growth plan &mdash; Up to 500 employees</p>
            </div>
            <Badge variant="success">Active</Badge>
          </div>
          <div className="pt-5 border-t border-neutral-100">
            <Button variant="outline" size="md">Manage billing</Button>
          </div>
        </div>
      </section>

      {/* Workshop defaults */}
      <section className="mb-8">
        <h2 className="text-[14px] font-semibold text-neutral-900 mb-4">Workshop defaults</h2>
        <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-neutral-200/60">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-[12px] font-medium text-neutral-400 uppercase tracking-wider">Default seat cap</label>
              <input
                type="number"
                className="w-full mt-2 h-11 px-4 rounded-xl border border-neutral-200 text-[14px] text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300 transition-all"
                defaultValue="50"
              />
            </div>
            <div>
              <label className="text-[12px] font-medium text-neutral-400 uppercase tracking-wider">Reminder before event</label>
              <select className="w-full mt-2 h-11 px-4 rounded-xl border border-neutral-200 text-[14px] text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300 transition-all appearance-none">
                <option>1 hour</option>
                <option>24 hours</option>
                <option>48 hours</option>
              </select>
            </div>
          </div>
          <div className="pt-5 mt-5 border-t border-neutral-100">
            <Button variant="primary" size="md">Save defaults</Button>
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section>
        <h2 className="text-[14px] font-semibold text-neutral-900 mb-4">Notification rules</h2>
        <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-neutral-200/60">
          {['New employee requests', 'Workshop reminders', 'Weekly engagement digest', 'Billing updates'].map((rule, i, arr) => (
            <label
              key={rule}
              className={`flex items-center justify-between py-4 cursor-pointer ${
                i < arr.length - 1 ? 'border-b border-neutral-100' : ''
              }`}
            >
              <span className="text-[14px] text-neutral-900">{rule}</span>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-neutral-900 cursor-pointer rounded" />
            </label>
          ))}
        </div>
      </section>
    </div>
  );
}
