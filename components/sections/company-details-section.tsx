import { type CompanyResponse } from '@/helpers/company-types';
import convertCentsToAmount from '@/utils/convertCentsToAmount';

function CompanyDetailsSection(props: CompanyResponse) {
  return (
    <section className="border-b py-4">
      <small>Company Reference</small>
      <div className="grid grid-cols-2 gap-1 mt-3">
        <div className="flex gap-2">
          <div>Company name:</div>
          <div className="underline">{props?.company_name}</div>
        </div>
        <div className="flex gap-2">
          <div>Currency:</div>
          <div className="underline">{props?.currency}</div>
        </div>
        <div className="flex gap-2">
          <div>Owner name:</div>
          <div className="underline">{props?.owner_name}</div>
        </div>
        <div className="flex gap-2">
          <div>Commission rate:</div>
          <div className="underline">{`${props?.commission_rate && props?.commission_rate}%`}</div>
        </div>
        <div className="flex gap-2">
          <div>Expenses rate:</div>
          <div className="underline">{`${props?.expenses_rate && props?.expenses_rate}%`}</div>
        </div>
        <div className="flex gap-2">
          <div>Over time rate:</div>
          <div className="underline">
            {props?.over_time_rate &&
              Intl.NumberFormat('en', {
                style: 'currency',
                currency: props?.currency,
              }).format(convertCentsToAmount(Number(props.over_time_rate)))}
          </div>
        </div>
        <div className="flex gap-2">
          <div>Per hour rate:</div>
          <div className="underline">
            {props?.per_hour_rate &&
              Intl.NumberFormat('en', {
                style: 'currency',
                currency: props?.currency,
              }).format(convertCentsToAmount(Number(props.per_hour_rate)))}
          </div>
        </div>
        <div className="flex gap-2">
          <div>Per day rate:</div>
          <div className="underline">
            {props?.per_day_rate &&
              Intl.NumberFormat('en', {
                style: 'currency',
                currency: props?.currency,
              }).format(convertCentsToAmount(Number(props.per_day_rate)))}
          </div>
        </div>
        <div className="flex gap-2">
          <div>Per month rate:</div>
          <div className="underline">
            {props?.per_month_rate &&
              Intl.NumberFormat('en', {
                style: 'currency',
                currency: props?.currency,
              }).format(convertCentsToAmount(Number(props.per_month_rate)))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CompanyDetailsSection;
