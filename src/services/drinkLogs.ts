import { supabase } from '../lib/supabase';
import type { DrinkType, DrinkLog } from '../types';
import { DRINK_INFO } from '../types';

export interface CreateDrinkLogParams {
  userId: string;
  date: string;
  drinkType: DrinkType;
  amount: number;
  memo?: string;
}

export interface DrinkLogRow {
  id: string;
  user_id: string;
  date: string;
  drink_type: DrinkType;
  amount: number;
  volume_ml: number;
  memo: string | null;
  created_at: string;
}

function rowToLog(row: DrinkLogRow): DrinkLog {
  return {
    id: row.id,
    userId: row.user_id,
    date: row.date,
    drinkType: row.drink_type,
    amount: row.amount,
    volumeMl: row.volume_ml,
    memo: row.memo ?? undefined,
    createdAt: row.created_at,
  };
}

export const drinkLogsService = {
  async create(params: CreateDrinkLogParams): Promise<DrinkLog> {
    const volumeMl = params.amount * DRINK_INFO[params.drinkType].mlPerBottle;

    const { data, error } = await supabase
      .from('drink_logs')
      .insert({
        user_id: params.userId,
        date: params.date,
        drink_type: params.drinkType,
        amount: params.amount,
        volume_ml: volumeMl,
        memo: params.memo,
      })
      .select()
      .single();

    if (error) throw error;
    return rowToLog(data);
  },

  async getByDate(userId: string, date: string): Promise<DrinkLog[]> {
    const { data, error } = await supabase
      .from('drink_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data || []).map(rowToLog);
  },

  async getByDateRange(userId: string, startDate: string, endDate: string): Promise<DrinkLog[]> {
    const { data, error } = await supabase
      .from('drink_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });

    if (error) throw error;
    return (data || []).map(rowToLog);
  },

  async getByMonth(userId: string, year: number, month: number): Promise<DrinkLog[]> {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;

    return this.getByDateRange(userId, startDate, endDate);
  },

  async delete(logId: string): Promise<void> {
    const { error } = await supabase
      .from('drink_logs')
      .delete()
      .eq('id', logId);

    if (error) throw error;
  },

  async update(logId: string, updates: Partial<Pick<CreateDrinkLogParams, 'amount' | 'memo'>>): Promise<DrinkLog> {
    const updateData: Record<string, unknown> = { ...updates };
    
    if (updates.amount !== undefined) {
      const { data: existing } = await supabase
        .from('drink_logs')
        .select('drink_type')
        .eq('id', logId)
        .single();
      
      if (existing) {
        updateData.volume_ml = updates.amount * DRINK_INFO[existing.drink_type as DrinkType].mlPerBottle;
      }
    }

    const { data, error } = await supabase
      .from('drink_logs')
      .update(updateData)
      .eq('id', logId)
      .select()
      .single();

    if (error) throw error;
    return rowToLog(data);
  },
};
