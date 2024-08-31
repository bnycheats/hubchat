import { TypeOfLeaveEnums } from '@/helpers/application-types';

export default [
  { name: 'Vacation Leave', value: TypeOfLeaveEnums.VACATION_LEAVE },
  { name: 'Sick Leave', value: TypeOfLeaveEnums.SICK_LEAVE },
  { name: 'Emergency Leave', value: TypeOfLeaveEnums.EMERGENCY_LEAVE },
  { name: 'Birthday Leave', value: TypeOfLeaveEnums.BIRTHDAY_LEAVE },
  { name: 'Bereavement', value: TypeOfLeaveEnums.BEREAVEMENT },
  { name: 'Maternity Leave', value: TypeOfLeaveEnums.MATERNITY_LEAVE },
  { name: 'Paternal Leave', value: TypeOfLeaveEnums.PATERNAL_LEAVE },
  { name: 'Other', value: TypeOfLeaveEnums.OTHER },
];
