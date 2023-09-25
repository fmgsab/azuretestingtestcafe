import React, { Children, useEffect, useId, useRef, useState } from 'react';
import { v4 } from 'uuid';
import { useWatch } from 'react-hook-form';
import classnames from 'classnames';
import { useSpring, animated } from '@react-spring/web';
import { type FieldProps, type OptionProps, type UseScopeProps } from '../../types';
import { useScope } from '../../hooks';
import { ScopeContext, useScopeContext } from '../../context/ScopeContext';
import { ternary } from '@fmg/utils/src/ternary/ternary';

type ScopedGroupProps = {
  children: React.ReactElement | React.ReactElement[];
  className?: string;
  highlight?: boolean;
  inline?: boolean;
  options?: OptionProps[];
  shouldReset?: boolean;
} & Partial<Omit<FieldProps, 'options'>>;

export type ScopeTargetProps = ScopedGroupProps & Omit<UseScopeProps, 'source'>;

/**
 * Hook that stores and evaluates targets' visibility statuses
 */
export function useScopeRoot() {
  const targets = useRef<Record<string, boolean>>({});
  function registerTarget(id: string, isVisible = false) {
    targets.current[id] = isVisible;
  }

  const hasVisibleTarget = () => Object.values(targets.current).reduce((acc, val) => acc || val, false);

  return { registerTarget, hasVisibleTarget };
}

/**
 * Utility wrapper component for conditional rendering
 * @param children
 * @param className
 * @param highlight
 * @param inline
 * @param options can be passed in if this scope has a parent
 * @constructor
 */
export function Scope({ children, className, highlight = false, inline = false, options }: ScopedGroupProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { registerTarget, hasVisibleTarget } = useScopeRoot();

  return (
    <ScopeContext.Provider value={{ highlight, inline, isExpanded, setIsExpanded, registerTarget, hasVisibleTarget, options, source: '' }}>
      <ScopedGroup className={className}>{children}</ScopedGroup>
    </ScopeContext.Provider>
  );
}

export function ScopedGroup({ children, className }: ScopedGroupProps) {
  const { highlight, isExpanded, inline } = useScopeContext();

  const nodeRef = useRef(null);

  return (
    <div
      ref={nodeRef}
      className={classnames(
        'scoped-group border-x-2 border-transparent',
        {
          'bg-fmg-green-3 !border-fmg-green-25 transition-color rounded-sm py-3 duration-300': highlight && isExpanded,
          'form-container': inline,
        },
        className
      )}
    >
      {children}
    </div>
  );
}

function Source({ children, reference, ...props }: ScopedGroupProps & { reference?: string | string[] }) {
  const context = useScopeContext();
  const allReferences = [reference].flat().filter(Boolean);

  return (
    <div className={classnames({ 'form-container': !context.inline })}>
      {Children.map(children, (child) => {
        const sourceName = child.props.name;
        context.source = allReferences.length ? [...allReferences, sourceName] : sourceName;
        //console.log(context.options, child.props.options);
        return React.cloneElement(child, { options: context.options ?? child.props.options, ...props });
      })}
    </div>
  );
}

function Target({ children, condition, values, shouldReset, ...props }: ScopeTargetProps) {
  const key = useRef(v4());
  const id = useId();
  const context = useScopeContext();
  useWatch({ name: context.source });

  const fieldsToReset = shouldReset ? Children.map(children, (child) => child.props.name) : [];
  const { isVisible, isEnabled, options } = useScope({ ...context, condition, values, fieldsToReset, ...props });

  useEffect(() => {
    context.registerTarget?.(id, isVisible);
    context.setIsExpanded?.(Boolean(condition) && (context.hasVisibleTarget?.() || false));
  });

  useEffect(() => {
    if (!isVisible) {
      key.current = v4();
    }
  }, [isVisible]);

  const style = useSpring({
    from: { display: 'none', opacity: 0 },
    to: isVisible ? { opacity: 1, display: 'block' } : {},
    delay: ternary(context.inline && !isVisible, 300, 100),
    duration: ternary(context.inline, 400, 500),
    reverse: !isVisible,
    immediate: context.inline,
  });

  return (
    <animated.div style={style} key={key.current}>
      <div className={classnames({ 'form-container': !context.inline })}>
        {Children.map(children, (child) => {
          //console.log(child.props);
          // TODO: Write test for cloning options
          return React.cloneElement(child, {
            options: options ?? child.props.options,
            ...props,
            ...child.props,
            disabled: !isEnabled,
            'aria-disabled': !isEnabled,
          });
        })}
      </div>
    </animated.div>
  );
}

Scope.Source = Source;
Scope.Target = Target;

export default Scope;
