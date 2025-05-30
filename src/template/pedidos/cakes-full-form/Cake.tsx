import * as S from './styles'

import { FormDataPedidos } from '@/app/pedidos/types'
import { useFormCorePedidos } from '@/app/pedidos/useFormCorePedidos'
import { InputForm } from '@/components/ui-componets/input-form'
import { SelectForm } from '@/components/ui-componets/select-form'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Recheios } from '../recheios'
import { TextareaForm } from '@/components/ui-componets/textarea-form'
import { Label } from '@/components/ui/label'
import { PlusCircle } from 'lucide-react'

import { CheckboxForm } from '@/components/ui-componets/checkbox-form/CheckboxForm'
import { Button } from '@/components/ui/button'

export const Cake = ({ cakeIndex, children }: { cakeIndex: number; children: React.ReactNode }) => {
  const methods = useFormContext<FormDataPedidos>()
  const cake = useFormCorePedidos()

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: `cakes.${cakeIndex}.recheios`,
  })

  const imageCake = methods.watch(`cakes.${cakeIndex}.banner`)

  const imageValid = imageCake?.includes('https://') || imageCake?.includes('http://') ? imageCake : ''
  return (
    <S.containerCake>
      <InputForm control={methods.control} name={`cakes.${cakeIndex}.id`} className="hidden" />

      <div className="flex gap-3">
        <InputForm
          type="number"
          min={0}
          step={0.001}
          typeof="numeric"
          control={methods.control}
          name={`cakes.${cakeIndex}.peso`}
          label="Peso/kg"
          onChange={() => {
            methods.setValue(`cakes.${cakeIndex}.price`, cake.getPriceCake(cakeIndex))
          }}
          autoFocus
        />
        <SelectForm
          control={methods.control}
          name={`cakes.${cakeIndex}.formato`}
          label="Formato"
          data={[
            { label: 'Redondo', value: 'REDONDO' },
            { label: 'Quadrado', value: 'QUADRADO' },
          ]}
        />
        <SelectForm
          control={methods.control}
          name={`cakes.${cakeIndex}.massa`}
          label="Massa"
          data={[
            { label: 'Branca', value: 'BRANCA' },
            { label: 'Chocolate', value: 'CHOCOLATE' },
            { label: 'Massa mesclada', value: 'MASSA_MESCLADA' },
          ]}
        />
      </div>

      <Label>Recheios</Label>
      <div className="flex flex-wrap gap-5">
        {fields.map((field, IndexRecheio) => (
          <Recheios key={field.id} cakeIndex={cakeIndex} recheioIndex={IndexRecheio} remove={remove} />
        ))}
      </div>

      <Button type="button" variant="link" onClick={() => append({})} className="w-min">
        Adicionar recheio
        <PlusCircle className="ml-2 h-4 w-4" />
      </Button>

      <InputForm
        control={methods.control}
        name={`cakes.${cakeIndex}.price`}
        label="Preço"
        type="number"
        typeof="numeric"
        min={0}
        step={0.01}
      />

      <SelectForm
        control={methods.control}
        name={`cakes.${cakeIndex}.cobertura`}
        label="Cobertura"
        data={[
          { label: 'Chantilly', value: 'CHANTILLY' },
          { label: 'Avela batido', value: 'AVELA_BATIDO' },
          { label: 'Clara queimada', value: 'CLARA_QUEIMADA' },
          { label: 'KitKat', value: 'KIT_KAT' },
        ]}
        onChange={() => {
          methods.setValue(`cakes.${cakeIndex}.price`, cake.getPriceCake(cakeIndex))
        }}
      />

      <TextareaForm control={methods.control} name={`cakes.${cakeIndex}.decoracao`} label="Descricão" />

      <InputForm
        control={methods.control}
        name={`cakes.${cakeIndex}.banner`}
        type="url"
        label="Foto do bolo"
        autoFocus={false}
      />

      {imageValid && <img src={imageValid} alt="Cake" width={200} height={200} className="rounded-xl" />}

      <CheckboxForm control={methods.control} name={`cakes.${cakeIndex}.tem_topper`} label="Tem topper" />

      {children}
    </S.containerCake>
  )
}
